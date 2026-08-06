<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import EffectControlsPanel from './EffectControlsPanel.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/webgl-image-reveal.json';
import webglImageRevealAssetUrl from '../scripts/webgl-image-reveal.js?url';
import '../styles/webgl-image-reveal.css';

const IMAGE_URLS = [
  'https://picsum.photos/id/1015/800/500',
  'https://picsum.photos/id/1018/800/500',
  'https://picsum.photos/id/1019/800/500'
];
const webglImageRevealDownloadUrl = webglImageRevealAssetUrl.split('?')[0];

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const canvasContainer = ref(null);
const loading = ref(true);
const loadError = ref(false);
const selectedVariant = ref(effectData.defaults.variant);
const variantPreview = computed(() => effectData.preview.variants[selectedVariant.value]);
const currentCode = computed(() => {
  if (selectedVariant.value === 'slice-displacement') {
    return `await initWebGLImageReveal({\n  container,\n  variant: 'slice-displacement',\n  imageUrls: [\n    '${IMAGE_URLS[0]}',\n    '${IMAGE_URLS[1]}',\n    '${IMAGE_URLS[2]}'\n  ],\n  slices: 10\n});`;
  }

  return `await initWebGLImageReveal({\n  container,\n  imageUrl: '${IMAGE_URLS[0]}'\n});`;
});

let reveal = null;
let disposed = false;
let initializationId = 0;

function play() {
  reveal?.play();
}

function reset() {
  reveal?.reset();
}

async function initializeReveal() {
  const requestId = ++initializationId;
  loading.value = true;
  loadError.value = false;
  reveal?.destroy();
  reveal = null;
  await nextTick();

  try {
    const { initWebGLImageReveal } = await import('../scripts/webgl-image-reveal.js');
    const instance = await initWebGLImageReveal({
      container: canvasContainer.value,
      imageUrl: IMAGE_URLS[0],
      imageUrls: IMAGE_URLS,
      variant: selectedVariant.value,
      slices: 10
    });

    if (disposed || requestId !== initializationId) {
      instance.destroy();
      return;
    }

    reveal = instance;
  } catch {
    if (requestId === initializationId) loadError.value = true;
  } finally {
    if (requestId === initializationId) loading.value = false;
  }
}

function selectVariant({ key, value }) {
  if (key !== 'variant' || value === selectedVariant.value) return;
  selectedVariant.value = value;
  initializeReveal();
}

onMounted(initializeReveal);

onBeforeUnmount(() => {
  disposed = true;
  initializationId += 1;
  reveal?.destroy();
});
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}js-effects/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}js-effects/`"
        :info="effectData.info"
        :usage="effectData.usage"
        :current-code="currentCode"
        :download-href="webglImageRevealDownloadUrl"
        download-filename="webgl-image-reveal.js"
      />

      <section class="webgl-reveal-notes" aria-labelledby="webgl-reveal-notes-title">
        <h2 id="webgl-reveal-notes-title">{{ effectData.usage.notesTitle }}</h2>
        <ul>
          <li v-for="note in effectData.usage.notes" :key="note">{{ note }}</li>
        </ul>
      </section>
    </template>

    <template #preview>
      <div class="webgl-reveal-demo">
        <p class="webgl-reveal-demo__label">{{ effectData.preview.label }}</p>
        <div ref="canvasContainer" class="webgl-reveal-demo__canvas" aria-label="WebGL 圖片還原效果">
          <p v-if="loading" class="webgl-reveal-demo__status">
            {{ effectData.preview.loading }}
          </p>
          <p v-else-if="loadError" class="webgl-reveal-demo__status webgl-reveal-demo__status--error">
            {{ effectData.preview.error }}
          </p>
        </div>

        <div class="webgl-reveal-demo__actions">
          <button type="button" :disabled="loading || loadError" @click="play">
            {{ variantPreview.playLabel }}
          </button>
          <button type="button" :disabled="loading || loadError" @click="reset">
            {{ effectData.preview.resetLabel }}
          </button>
        </div>
      </div>
    </template>

    <template #controls>
      <EffectControlsPanel
        :config="effectData.controls"
        :model-value="{ variant: selectedVariant }"
        @select-choice="selectVariant"
      />

      <section class="webgl-reveal-controls__parameters">
        <p class="effect-controls__title">{{ effectData.preview.parametersTitle }}</p>
        <dl>
          <div v-for="parameter in variantPreview.parameters" :key="parameter.label">
            <dt>{{ parameter.label }}</dt>
            <dd>{{ parameter.value }}</dd>
          </div>
        </dl>
      </section>
    </template>
  </EffectShowcaseLayout>
</template>
