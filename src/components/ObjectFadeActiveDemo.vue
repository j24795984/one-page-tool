<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EffectControlsPanel from './EffectControlsPanel.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/object-fade-active.json';
import '../styles/object-fade-active.css';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const settings = reactive({ ...effectData.defaults });

const parameterCode = computed(() => {
  return `data-object-fade="fade=${settings.direction}&duration=${settings.duration}&offset=${settings.offset}&start=${settings.start}%&stagger=${settings.stagger}&delay=${settings.delay}&ease=${settings.ease}&reset=${settings.reset}"`;
});

const previewRoot = ref(null);
const scroller = ref(null);

let cleanupEffect = () => {};
let initEffect;

function restartEffect() {
  if (!initEffect) return;

  cleanupEffect();
  scroller.value.scrollTop = 0;
  cleanupEffect = initEffect({
    direction: settings.direction,
    options: {
      duration: settings.duration,
      offset: settings.offset,
      start: settings.start,
      stagger: settings.stagger,
      delay: settings.delay,
      ease: settings.ease,
      reset: settings.reset
    },
    root: previewRoot.value,
    scroller: scroller.value
  });
}

function updateSetting({ key, value }) {
  settings[key] = value;
}

function selectChoice(setting) {
  updateSetting(setting);
  restartEffect();
}

onMounted(async () => {
  ({ initObjectFadeActive: initEffect } = await import('../scripts/object-fade-active.js'));
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
      />
    </template>

    <template #preview>
      <div ref="scroller" class="effect-preview-scroll object-fade-demo">
        <div class="object-fade-demo__intro">
          <div class="object-fade-demo__intro-inner">
            <p class="object-fade-demo__intro-label">{{ effectData.preview.label }}</p>
            <h2 class="object-fade-demo__intro-title">{{ effectData.preview.title }}</h2>
            <span class="object-fade-demo__scroll-hint">{{ effectData.preview.hint }}</span>
          </div>
        </div>

        <div ref="previewRoot" class="object-fade-demo__grid">
          <article
            v-for="(card, index) in effectData.preview.cards"
            :key="card"
            class="object-fade-demo__card"
            data-object-fade
          >
            <span class="object-fade-demo__card-index">0{{ index + 1 }}</span>
            <h3 class="object-fade-demo__card-title">{{ card }}</h3>
          </article>
        </div>
      </div>
    </template>

    <template #controls>
      <EffectControlsPanel
        :config="effectData.controls"
        :model-value="settings"
        @apply="restartEffect"
        @select-choice="selectChoice"
        @update-setting="updateSetting"
      />
    </template>
  </EffectShowcaseLayout>
</template>
