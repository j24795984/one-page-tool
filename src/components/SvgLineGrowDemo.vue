<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
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
let initEffect;
function restartEffect() {
 if (!initEffect) return;
 lineGrow?.destroy();
 lineGrow = initEffect({ path: pathElement.value });
}

onMounted(async () => {
  ({ initSvgLineGrow: initEffect } = await import('../scripts/svg-line-grow.js'));
  restartEffect();
});

onBeforeUnmount(() => {
  lineGrow?.destroy();
});
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}ui/`"
        :info="effectData.info"
        :usage="effectData.usage"
        :current-code="currentCode"
        :download-href="svgLineGrowDownloadUrl"
        download-filename="svg-line-grow.js"
      />
    </template>

    <template #toolbar><EffectPreviewToolbar @replay="restartEffect" /></template>

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

  </EffectShowcaseLayout>
</template>
