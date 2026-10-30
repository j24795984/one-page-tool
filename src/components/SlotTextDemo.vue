<script setup>
import { ref } from 'vue';
import SlotText from './SlotText.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import data from '../data/js-effects/slot-text.json';
import scriptUrl from '../scripts/slot-text.js?url';
import css from '../styles/slot-text.css?raw';
defineProps({ baseUrl: String });
const scene = ref(null);
const usage = { ...data.usage, examples: [...data.usage.examples, { label: 'CSS', code: css }] };
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info><EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="data.info" :usage="usage" :current-code="data.usage.examples[1].code" :download-href="scriptUrl" download-filename="slot-text.js" /></template>
    <template #toolbar><EffectPreviewToolbar @replay="scene?.restart()" /></template>
    <template #preview><SlotText ref="scene" /></template>
  </EffectShowcaseLayout>
</template>
