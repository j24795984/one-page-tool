<script setup>
import { ref, useId, onMounted, onBeforeUnmount, watch } from 'vue';
import { initLiquidRadio } from '../scripts/liquid-radio.js';
import { initInteractionSimulation } from '../scripts/interaction-simulation.js';
import { initInteractivePreview } from '../scripts/interactive-preview.js';
import '../styles/liquid-radio.css';
const props = defineProps({ preview: Boolean, running: { type: Boolean, default: true } });
const root = ref(null);
const stage = ref(null);
const group = useId();
let effect;
onMounted(() => { effect = initInteractivePreview({ root: stage.value, simulate: controller => initInteractionSimulation({root:stage.value,kind:'liquid-radio',controls:controller.controls}), preview: props.preview, running: props.running, create: options => initLiquidRadio({ root: root.value, ...options }) }); });
watch(() => props.running, value => effect?.setRunning(value));
onBeforeUnmount(() => effect?.destroy());
</script>
<template>
  <div ref="stage" class="liquid-stage" :class="{ 'liquid-stage--preview': preview }">
    <fieldset ref="root" class="liquid-radio" aria-label="配送方式">
      <label v-for="(option, index) in ['標準寄送', '快速到貨', '門市自取']" :key="option">
        <input type="radio" :name="group" :value="option" :checked="index === 0">
        <i aria-hidden="true"></i><span>{{ option }}</span>
      </label>
      <span data-liquid-dot aria-hidden="true"></span>
    </fieldset>
  </div>
</template>
<style scoped>
.liquid-stage { width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:24px; background:#f7f7f4; }
.liquid-stage--preview { position:absolute; inset:0; padding:0; container-type:inline-size; }
.liquid-stage--preview .liquid-radio { flex-shrink:0; max-width:none; transform:scale(0.65); transform:scale(calc(100cqw / 420px)); }
</style>
