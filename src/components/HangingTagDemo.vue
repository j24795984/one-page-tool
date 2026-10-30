<script setup>
import { ref } from 'vue';
import HangingTag from './HangingTag.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import source from '../scripts/hanging-tag.js?url';
import css from '../styles/hanging-tag.css?raw';
defineProps({ baseUrl: String });
const scene = ref(null);
const html = '<div class="hanging-tag" style="height:400px"><div data-sway class="hanging-tag__sway"><div data-lift class="hanging-tag__lift"><div data-tag class="hanging-tag__card">A</div></div></div></div>';
const code = `import { createEffect } from './hanging-tag.js';
const root = document.querySelector('.hanging-tag');
const effect = createEffect({ element: root });
if (matchMedia('(prefers-reduced-motion: reduce)').matches) effect.timeline.pause('rest');
else effect.timeline.play();
// 卸載時呼叫 effect.destroy();`;
const usage = { title:'使用方式', description:'引入 GSAP 與下方 CSS。模組提供單次入場與收回；本站由 Vue 展示層管理 A–D 換字、循環及背景暫停，不使用 React。', currentLabel:'單次播放初始化', examples:[{label:'HTML',code:html},{label:'JavaScript / ESM',code},{label:'CSS',code:css}], parameters:[{name:'element',description:'包含 data-sway、data-lift、data-tag 的展示根元素。'},{name:'timeline',description:'暫停的 GSAP 時間軸；play() 播放，pause() 暫停，pause("rest") 顯示停穩吊牌。'},{name:'destroy()',description:'清除時間軸並還原原始行內樣式。'}] };
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info><EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="{eyebrow:'UI Effect',title:'吊牌擺動 Hanging Tag',summary:'吊牌落下後左右擺動，停穩再收回，依序展示字母。'}" :usage="usage" :current-code="code" :download-href="source" download-filename="hanging-tag.js" /></template>
    <template #toolbar><EffectPreviewToolbar @replay="scene?.restart()" /></template>
    <template #preview><HangingTag ref="scene" /></template>
  </EffectShowcaseLayout>
</template>
