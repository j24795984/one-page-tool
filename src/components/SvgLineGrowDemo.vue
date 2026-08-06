<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/svg-line-grow.json';
import svgLineGrowAssetUrl from '../scripts/svg-line-grow.js?url';
import '../styles/svg-line-grow.css';

const svgLineGrowDownloadUrl = svgLineGrowAssetUrl.split('?')[0];
const currentCode = `initSvgLineGrow({\n  path: document.querySelector('#line-path')\n});`;

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const pathElement = ref(null);
let lineGrow = null;

onMounted(async () => {
  const { initSvgLineGrow } = await import('../scripts/svg-line-grow.js');
  lineGrow = initSvgLineGrow({ path: pathElement.value });
});

onBeforeUnmount(() => {
  lineGrow?.destroy();
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
        :download-href="svgLineGrowDownloadUrl"
        download-filename="svg-line-grow.js"
      />
    </template>

    <template #preview>
      <div class="svg-line-grow-demo">
        <p class="svg-line-grow-demo__label">{{ effectData.preview.label }}</p>
        <div class="svg-line-grow-demo__canvas" aria-label="SVG 線條生長效果">
          <svg viewBox="0 0 32.36 140.46" xmlns="http://www.w3.org/2000/svg">
            <path
              ref="pathElement"
              d="M16.42,0v108.63c-8.86,0-16.04,7.3-15.92,15.92.12,8.35,7.05,15.27,15.41,15.41,8.76.15,16.12-7.2,15.95-15.95-.16-8.24-6.97-15.13-15.44-15.38"
            />
          </svg>
        </div>
      </div>
    </template>

    <template #controls>
      <div class="svg-line-grow-controls">
        <section>
          <p class="effect-controls__title">{{ effectData.preview.styleTitle }}</p>
          <div class="svg-line-grow-controls__style" aria-current="true">
            <strong>{{ effectData.preview.styleLabel }}</strong>
            <span>{{ effectData.preview.styleNote }}</span>
          </div>
        </section>

        <section class="svg-line-grow-controls__parameters">
          <p class="effect-controls__title">{{ effectData.preview.parametersTitle }}</p>
          <dl>
            <div v-for="parameter in effectData.preview.parameters" :key="parameter.label">
              <dt>{{ parameter.label }}</dt>
              <dd>{{ parameter.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </template>
  </EffectShowcaseLayout>
</template>
