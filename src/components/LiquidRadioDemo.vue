<script setup>
import LiquidRadio from './LiquidRadio.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import data from '../data/js-effects/liquid-radio.json';
import scriptUrl from '../scripts/liquid-radio.js?url';
import css from '../styles/liquid-radio.css?raw';
defineProps({ baseUrl: { type: String, required: true } });
const usage = { ...data.usage, examples: [...data.usage.examples, { label: 'CSS', code: css }] };
const currentCode = "const radio = initLiquidRadio({ root: document.querySelector('.liquid-radio') });";
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="data.info" :usage="usage" :current-code="currentCode"
        :download-href="scriptUrl.split('?')[0]" download-filename="liquid-radio.js" />
      <p class="liquid-source">效果參考：<a href="https://kittenjam-motion-library.vercel.app/" target="_blank" rel="noreferrer">Motion Library · 250 Liquid Radio</a></p>
    </template>
    <template #preview><LiquidRadio /></template>
  </EffectShowcaseLayout>
</template>
<style scoped>.liquid-source { margin-top:24px; font-size:14px; line-height:1.7; } .liquid-source a { text-decoration:underline; }</style>
