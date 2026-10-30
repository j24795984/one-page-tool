<script setup>
import { computed, defineAsyncComponent, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
const EffectCardScene = defineAsyncComponent(() => import('./EffectCardScene.vue'));
import { textEffects } from '../data/text-effects.js';
const TextMotion = defineAsyncComponent(() => import('./TextMotion.vue'));
const SlotText = defineAsyncComponent(() => import('./SlotText.vue'));
const HangingTag = defineAsyncComponent(() => import('./HangingTag.vue'));
const SearchBox = defineAsyncComponent(() => import('./SearchBox.vue'));
const DonutChart = defineAsyncComponent(() => import('./DonutChart.vue'));
import { buttonEffects } from '../data/button-effects.js';
const ButtonEffect = defineAsyncComponent(() => import('./ButtonEffect.vue'));
const LiquidRadio = defineAsyncComponent(() => import('./LiquidRadio.vue'));
const ParallaxCard = defineAsyncComponent(() => import('./ParallaxCard.vue'));
const props = defineProps({ item: { type: Object, required: true } });
const { scheduler, active, suspended } = inject('preview-controller');
const root = ref(null);
const visible = ref(false);
const completed = ref(false);
const failed = ref(false);
const running = computed(() => active.value.includes(props.item.id));
const preview = computed(() => props.item.preview);
const interactive = computed(() => props.item.types.some(type => ['按鈕', '表單'].includes(type)));
let observer, cooldown;
function complete() { completed.value = true; scheduler.complete(props.item.id); }
function fail() { failed.value = true; scheduler.stop(props.item.id); }
watch([completed, visible, suspended], () => {
  clearTimeout(cooldown);
  if (completed.value && visible.value && !suspended.value) {
    cooldown = setTimeout(() => { completed.value = false; scheduler.requeue(props.item.id); }, 200);
  }
});
onMounted(() => {
  scheduler.register(props.item.id, preview.value.mode === 'auto');
  observer = new IntersectionObserver(([entry]) => {
    visible.value = entry.isIntersecting && entry.intersectionRatio >= 0.4;
    scheduler.visible(props.item.id, visible.value);
  }, { threshold: [0, 0.4] });
  observer.observe(root.value);
});
onBeforeUnmount(() => { clearTimeout(cooldown); observer?.disconnect(); scheduler.remove(props.item.id); });
</script>
<template>
  <div class="card-demo">
    <div ref="root" class="showcase-card__preview" :data-preview="item.id" :data-running="running" :role="interactive ? 'group' : 'img'" :aria-label="item.title + '，' + (interactive ? '互動展示' : preview.kind === 'document' ? '文件指南' : '非互動展示；完整體驗請點選名稱')">
      <div class="card-demo__scene" :class="{'card-demo__scene--interactive':interactive}" :inert="!interactive" :aria-hidden="interactive ? undefined : 'true'">
        <ParallaxCard v-if="item.id === 'parallax' && visible" :running="running" @complete="complete" @error="fail" />
        <TextMotion v-else-if="visible && textEffects.some(effect => effect.id === item.id)" :id="item.id" preview :running="running" />
        <SlotText v-else-if="item.id === 'slot-text' && visible" preview :running="running" />
        <HangingTag v-else-if="item.id === 'hanging-tag' && visible" :running="running" />
        <SearchBox v-else-if="['expand-search','morph-search'].includes(item.id) && visible" :variant="item.id === 'morph-search' ? 'morph' : 'expand'" preview :running="running" />
        <DonutChart v-else-if="item.id === 'donut-chart-segments' && visible" preview :running="running" @complete="complete" />
        <LiquidRadio v-else-if="item.id === 'liquid-radio' && visible" preview :running="running" />
        <ButtonEffect v-else-if="visible && buttonEffects.some(effect => effect.id === item.id)" :id="item.id" preview :running="running" />
        <EffectCardScene v-else-if="visible" :id="item.id" :running="running" @complete="complete" @error="fail" />
        <span v-else class="showcase-card__placeholder">{{ preview.kind === 'document' ? '路由 → 頁面 → 導覽狀態' : '效果示範' }}</span>
      </div>
      <span v-if="failed" class="showcase-card__placeholder card-demo__error">示範暫時無法載入，請點選名稱</span>
    </div>
  </div>
</template>

