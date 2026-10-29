<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { initDonutChart } from '../scripts/donut-chart.js';
const props = defineProps({ preview: Boolean, running: { type: Boolean, default: true } });
const emit = defineEmits(['complete']);
const root = ref(null);
const compact = ref(false);
let viewport;
function syncViewport() { compact.value = viewport.matches; }
const segments = [
  { label: '搜尋', value: 42, color: '#ff7a2f' },
  { label: '社群', value: 28, color: '#7c5cff' },
  { label: '直接', value: 18, color: '#00c8ff' },
  { label: '其他', value: 12, color: '#ffd23f' }
];
const circumference = 2 * Math.PI * 95;
const offset = index => -circumference * (segments.slice(0, index).reduce((sum, item) => sum + item.value, 0) / 100 + 0.006);
let effect;
onMounted(() => {
  viewport = window.matchMedia('(max-width:767px)');
  syncViewport();
  viewport.addEventListener('change', syncViewport);
  effect = initDonutChart({ root: root.value, preview: props.preview, running: props.running, onComplete: () => emit('complete') }); });
watch(() => props.running, value => effect?.setRunning(value));
onBeforeUnmount(() => { viewport?.removeEventListener('change', syncViewport); effect?.destroy(); });
defineExpose({ restart: () => effect?.restart() });
</script>
<template>
  <div ref="root" class="donut-chart" :class="{ 'donut-chart--preview': preview }">
    <svg :viewBox="compact && !preview ? '160 100 480 300' : '0 0 800 500'" role="img" aria-label="流量來源：搜尋 42%、社群 28%、直接 18%、其他 12%，合計 100%">
      <g transform="rotate(-90 300 250)" fill="none" stroke-width="32.5">
        <circle v-for="(segment, index) in segments" :key="segment.label" cx="300" cy="250" r="95"
          :stroke="segment.color" :data-percent="segment.value" :stroke-dashoffset="offset(index)"
          :stroke-dasharray="`${circumference * (segment.value / 100 - 0.012)} ${circumference * (1 - segment.value / 100 + 0.012)}`" />
      </g>
      <text x="300" y="254" text-anchor="middle" fill="#fff" font-size="38" font-weight="700">100%</text>
      <text x="300" y="282" text-anchor="middle" fill="#a5a7b1" font-size="16">流量來源</text>
      <g v-for="(segment, index) in segments" :key="segment.label" data-legend>
        <rect x="448" :y="191 + index * 36" width="14" height="14" :fill="segment.color" />
        <text x="474" :y="204 + index * 36" fill="#fff" font-size="19">{{ segment.label }}</text>
        <text x="600" :y="204 + index * 36" text-anchor="end" fill="#fff" font-size="19" font-weight="600">{{ segment.value }}%</text>
      </g>
    </svg>
  </div>
</template>
<style scoped>
.donut-chart { width:100%; height:100%; min-height:240px; display:flex; align-items:center; justify-content:center; background:#15161a; font-family:Inter,Arial,sans-serif; }
.donut-chart svg { display:block; width:100%; max-width:1000px; height:auto; max-height:100%; }
.donut-chart--preview { position:absolute; inset:0; min-height:0; }
</style>
