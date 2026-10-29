<script setup>
import { ref } from 'vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';

defineProps({
  baseUrl: { type: String, required: true },
  demoHref: { type: String, required: true },
  downloadHref: { type: String, required: true },
  downloadFilename: { type: String, required: true },
  info: { type: Object, required: true },
  usage: { type: Object, required: true }
});

const generation = ref(0);
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}ui/`"
        :info="info"
        :usage="usage"
        :download-href="downloadHref"
        :download-filename="downloadFilename"
      />
    </template>
    <template #toolbar>
      <button type="button" @click="generation++">↻ 重新播放</button>
      <a :href="demoHref" target="_blank" rel="noopener">開啟獨立展示 ↗</a>
    </template>
    <template #preview>
      <iframe :key="generation" :src="demoHref" :title="`${info.title} 效果展示`" />
    </template>
  </EffectShowcaseLayout>
</template>
