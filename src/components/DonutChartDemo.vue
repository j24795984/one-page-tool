<script setup>
import { ref } from 'vue';
import DonutChart from './DonutChart.vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/donut-chart-segments.json';
import scriptUrl from '../scripts/donut-chart.js?url';
defineProps({ baseUrl: { type: String, required: true } });
const chart = ref(null);
const currentCode = "initDonutChart({ root: document.querySelector('.chart') });";
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="effectData.info" :usage="effectData.usage"
        :current-code="currentCode" :download-href="scriptUrl.split('?')[0]" download-filename="donut-chart.js" />
      <p class="donut-source">效果參考：<a href="https://kittenjam-motion-library.vercel.app/" target="_blank" rel="noreferrer">Motion Library · Donut Chart Segments</a></p>
    </template>
    <template #toolbar><EffectPreviewToolbar @replay="chart?.restart()" /></template>
    <template #preview><DonutChart ref="chart" /></template>
  </EffectShowcaseLayout>
</template>
<style scoped>.donut-source { margin-top:24px; font-size:14px; line-height:1.7; } .donut-source a { text-decoration:underline; }</style>
