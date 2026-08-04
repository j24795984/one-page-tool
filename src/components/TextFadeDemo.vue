<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EffectControlsPanel from './EffectControlsPanel.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/text-fade.json';
import '../styles/text-fade.css';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const settings = reactive({ ...effectData.defaults });
const previewRoot = ref(null);
const scroller = ref(null);

const parameterCode = computed(() => {
  if (settings.variant === '3d') {
    return '<h2 data-fade-3dtext>Text reveal effect</h2>';
  }

  if (settings.variant === 'br') {
    return `<h2 data-fade-brtext data-fadeT-start="${settings.start}">\n  Text reveal<br>effect\n</h2>`;
  }

  return '<h2 data-fade-text>Text reveal effect</h2>';
});

const previewAttributes = computed(() => {
  if (settings.variant === '3d') return { 'data-fade-3dtext': '' };
  if (settings.variant === 'br') {
    return {
      'data-fade-brtext': '',
      'data-fadeT-start': settings.start
    };
  }

  return { 'data-fade-text': '' };
});

let cleanupEffect = () => {};
let initEffect;

function restartEffect() {
  if (!initEffect) return;

  cleanupEffect();
  scroller.value.scrollTop = 0;
  cleanupEffect = initEffect({
    root: previewRoot.value,
    scroller: scroller.value
  });
}

async function updateAndRestart({ key, value }) {
  cleanupEffect();
  cleanupEffect = () => {};
  settings[key] = value;
  await nextTick();
  restartEffect();
}

onMounted(async () => {
  ({ initFadeText: initEffect } = await import('../scripts/text-fade.js'));
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
      <div ref="scroller" class="effect-preview-scroll text-fade-demo">
        <header class="text-fade-demo__intro">
          <p class="text-fade-demo__intro-label">{{ effectData.preview.label }}</p>
          <h2 class="text-fade-demo__intro-title">{{ effectData.preview.title }}</h2>
          <span class="text-fade-demo__scroll-hint">{{ effectData.preview.hint }}</span>
        </header>

        <div ref="previewRoot" class="text-fade-demo__content">
          <section
            v-for="section in effectData.preview.sections"
            :key="section.label"
            class="text-fade-demo__section"
          >
            <p class="text-fade-demo__section-label">{{ section.label }}</p>
            <h3
              v-if="settings.variant === 'br'"
              v-bind="previewAttributes"
              class="text-fade-demo__text"
            >
              <template v-for="(line, index) in section.lines" :key="line">
                <br v-if="index">
                {{ line }}
              </template>
            </h3>
            <h3
              v-else
              v-bind="previewAttributes"
              class="text-fade-demo__text"
            >
              {{ section.lines.join(' ') }}
            </h3>
          </section>
        </div>
      </div>
    </template>

    <template #controls>
      <EffectControlsPanel
        :config="effectData.controls"
        :model-value="settings"
        @select-choice="updateAndRestart"
        @update-setting="updateAndRestart"
      />
    </template>
  </EffectShowcaseLayout>
</template>
