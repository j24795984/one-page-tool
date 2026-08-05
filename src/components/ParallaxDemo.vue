<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EffectControlsPanel from './EffectControlsPanel.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/parallax.json';
import parallaxDownloadUrl from '../scripts/parallax.js?url';
import '../styles/parallax.css';

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
  return `<div class="luxy-el" data-speed-y="${settings.speedY}" data-offset="${settings.offset}">\n  Parallax content\n</div>\n\nparallax.init({\n  targets: '.luxy-el',\n  targetSpeed: ${settings.targetSpeed},\n  scrub: ${settings.scrub}\n});`;
});

let parallaxEffect;

function restartEffect() {
  if (!parallaxEffect) return;

  parallaxEffect.destroy();
  scroller.value.scrollTop = 0;
  parallaxEffect.init({
    root: previewRoot.value,
    scroller: scroller.value,
    targetSpeed: settings.targetSpeed,
    scrub: settings.scrub
  });
}

function updateSetting({ key, value }) {
  settings[key] = value;
}

function refreshParallax() {
  parallaxEffect?.refresh();
}

onMounted(async () => {
  ({ parallax: parallaxEffect } = await import('../scripts/parallax.js'));
  restartEffect();
});

onBeforeUnmount(() => {
  parallaxEffect?.destroy();
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
        :download-href="parallaxDownloadUrl"
        download-filename="parallax.js"
      />
    </template>

    <template #preview>
      <div ref="scroller" class="effect-preview-scroll parallax-demo">
        <div ref="previewRoot" class="parallax-demo__content">
          <section
            v-for="section in effectData.preview.sections"
            :key="section.index"
            class="parallax-demo__section"
          >
            <header class="parallax-demo__section-heading">
              <p>Effect {{ section.index }}</p>
              <h2>{{ section.title }}</h2>
              <span>{{ section.note }}</span>
            </header>

            <div class="parallax-demo__stage">
              <span class="parallax-demo__stage-label">Parallax image demo</span>
              <figure
                class="luxy-el parallax-demo__object"
                :data-speed-y="settings.speedY"
                :data-offset="settings.offset"
              >
                <img
                  :src="section.image"
                  :alt="section.alt"
                  loading="lazy"
                  @load="refreshParallax"
                />
                <figcaption>
                  <span>Scroll-driven image</span>
                  <a :href="section.source" target="_blank" rel="noreferrer">
                    {{ section.credit }} / Unsplash
                  </a>
                </figcaption>
              </figure>
            </div>
          </section>
        </div>
      </div>
    </template>

    <template #controls>
      <EffectControlsPanel
        :config="effectData.controls"
        :model-value="settings"
        @apply="restartEffect"
        @update-setting="updateSetting"
      />
    </template>
  </EffectShowcaseLayout>
</template>
