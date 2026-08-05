<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EffectControlsPanel from './EffectControlsPanel.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/number-scroll.json';
import numberScrollDownloadUrl from '../scripts/number-scroll.js?url';
import '../styles/number-scroll.css';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const settings = reactive({ ...effectData.defaults });
const numberElement = ref(null);

const parameterCode = computed(() => (
  `<span data-number-scroll\n` +
  `  data-start="${settings.startValue}"\n` +
  `  data-end="${settings.endValue}"\n` +
  `  data-duration="${settings.duration}"\n` +
  `  data-decimals="${settings.decimals}"\n` +
  `  data-grouping="${settings.grouping}"\n` +
  `  data-prefix="${settings.prefix}"\n` +
  `  data-suffix="${settings.suffix}"\n` +
  `></span>`
));

let cleanupEffect = () => {};
let initEffect;

function updateSetting({ key, value }) {
  settings[key] = value;
}

function restartEffect() {
  if (!initEffect || !numberElement.value) return;

  cleanupEffect();
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

onMounted(async () => {
  ({ initNumberScroll: initEffect } = await import('../scripts/number-scroll.js'));
  restartEffect();
});

onBeforeUnmount(() => {
  cleanupEffect();
});
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}js-effects/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}js-effects/`"
        :info="effectData.info"
        :usage="effectData.usage"
        :current-code="parameterCode"
        :download-href="numberScrollDownloadUrl"
        download-filename="number-scroll.js"
      />
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

          <button class="number-scroll-demo__replay" type="button" @click="restartEffect">
            重新播放
            <span aria-hidden="true">↻</span>
          </button>
        </section>

        <dl class="number-scroll-demo__facts">
          <div v-for="fact in effectData.preview.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </template>

    <template #controls>
      <EffectControlsPanel
        :config="effectData.controls"
        :model-value="settings"
        @select-choice="updateSetting"
        @update-setting="updateSetting"
        @apply="restartEffect"
      />
    </template>
  </EffectShowcaseLayout>
</template>
