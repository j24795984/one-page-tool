<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import ParallaxContent from './ParallaxContent.vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/parallax.json';
import parallaxAssetUrl from '../scripts/parallax.js?url';
import '../styles/parallax.css';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const settings = { ...effectData.defaults };
const parallaxDownloadUrl = parallaxAssetUrl.split('?')[0];
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
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}ui/`"
        :info="effectData.info"
        :usage="effectData.usage"
        :current-code="parameterCode"
        :download-href="parallaxDownloadUrl"
        download-filename="parallax.js"
      />
    </template>

    <template #toolbar><EffectPreviewToolbar @replay="restartEffect" /></template>

    <template #preview>
      <div ref="scroller" class="effect-preview-scroll parallax-demo">
        <div ref="previewRoot" class="parallax-demo__content">
          <ParallaxContent :settings="settings" @image-load="refreshParallax" />
        </div>
      </div>
    </template>

  </EffectShowcaseLayout>
</template>
