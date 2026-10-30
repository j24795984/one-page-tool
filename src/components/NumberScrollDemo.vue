<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/number-scroll.json';
import numberScrollDownloadUrl from '../scripts/number-scroll.js?url';
import '../styles/number-scroll.css';
import numberCss from '../styles/number-scroll.css?raw';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const settings = reactive({ ...effectData.defaults });
const numberElement = ref(null);
const usage = { ...effectData.usage, examples: [...effectData.usage.examples, { label: 'CSS', code: numberCss }] };
const directionControls = { choiceKey: 'direction', choices: [{ label: 'Auto', value: 'auto' }, { label: 'Roll Up', value: 'up' }, { label: 'Roll Down', value: 'down' }] };

const parameterCode = computed(() => settings.mode === 'odometer'
  ? `const counter = createOdometer({ element: document.querySelector('[data-number-scroll]'), start: 12480, duration: 0.65, prefix: '$', ease: 'back.out(1.1)' });\ncounter.update(12481);`
  : `const cleanup = initNumberScroll(${JSON.stringify({ start: settings.startValue, end: settings.endValue, duration: settings.duration, decimals: settings.decimals, grouping: settings.grouping, prefix: settings.prefix, suffix: settings.suffix, direction: settings.direction, ease: settings.ease }, null, 2).replace('{', "{\n  element: document.querySelector('[data-number-scroll]'),")});`
);

let cleanupEffect = () => {};
let initEffect;
let createCounter, timer, motion;
function stopEffect() { clearInterval(timer); cleanupEffect(); cleanupEffect = () => {}; }

function updateSetting({ key, value }) {
  settings[key] = value;
}

function selectChoice(setting) {
  updateSetting(setting);
  restartEffect();
}

function restartEffect() {
  if (!initEffect || !numberElement.value) return;

  stopEffect();
  if (document.hidden) return;
  if (settings.mode === 'odometer') {
    const counter = createCounter({ element: numberElement.value, start: 12480, prefix: '$', duration: 0.65, ease: 'back.out(1.1)' });
    cleanupEffect = () => counter.destroy();
    if (!motion.matches) {
      let value = 12480;
      timer = setInterval(() => { value += 1; counter.update(value); }, 1000);
    }
    return;
  }
  cleanupEffect = initEffect({
    element: numberElement.value,
    start: settings.startValue,
    end: settings.endValue,
    duration: settings.duration,
    decimals: settings.decimals,
    grouping: settings.grouping,
    prefix: settings.prefix,
    suffix: settings.suffix,
    direction: settings.direction,
    ease: settings.ease
  });
}

let disposed = false;
onMounted(async () => {
  const module = await import('../scripts/number-scroll.js');
  if (disposed) return;
  initEffect = module.initNumberScroll;
  createCounter = module.createOdometer;
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', restartEffect);
  document.addEventListener('visibilitychange', restartEffect);
  restartEffect();
});

onBeforeUnmount(() => {
  disposed = true;
  stopEffect();
  motion?.removeEventListener('change', restartEffect);
  document.removeEventListener('visibilitychange', restartEffect);
});
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}ui/`"
        :info="effectData.info"
        :usage="usage"
        :current-code="parameterCode"
        :download-href="numberScrollDownloadUrl"
        download-filename="number-scroll.js"
      />
    </template>

    <template #toolbar>
      <EffectPreviewToolbar @replay="restartEffect" :config="effectData.controls" :model-value="settings" @select-choice="selectChoice" />
      <EffectPreviewToolbar v-if="settings.mode === 'reveal'" :replay="false" :config="directionControls" :model-value="settings" @select-choice="selectChoice" />
    </template>

    <template #preview>
      <div class="number-scroll-demo">
        <header class="number-scroll-demo__header">
          <p>{{ effectData.preview.label }}</p>
          <span>{{ effectData.preview.note }}</span>
        </header>

        <section class="number-scroll-demo__card">
          <p class="number-scroll-demo__metric-label">{{ effectData.preview.metricLabel }}</p>
          <div ref="numberElement" class="number-scroll"></div>
          <p class="number-scroll-demo__caption">{{ effectData.preview.caption }}</p>

        </section>

        <dl class="number-scroll-demo__facts">
          <div v-for="fact in effectData.preview.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </template>

  </EffectShowcaseLayout>
</template>
