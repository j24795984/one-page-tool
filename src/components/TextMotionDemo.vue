<script setup>
import { ref } from 'vue';
import TextMotion from './TextMotion.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import EffectPreviewToolbar from './EffectPreviewToolbar.vue';
import { textEffects } from '../data/text-effects.js';
import css from '../styles/text-motion.css?raw';
const props = defineProps({ id: String, baseUrl: String });
const data = textEffects.find(item => item.id === props.id);
const sources = import.meta.glob('../scripts/{split-invert,scroll-text-reveal,crumble-down,elastic-wave-stretch}.js', { eager: true, query: '?url', import: 'default' });
const scene = ref(null);
const isScroll = props.id === 'scroll-text-reveal';
const content = props.id === 'split-invert'
  ? `<div data-effect class="text-motion__stage" role="img" aria-label="${data.text}"><p class="text-motion__text" aria-hidden="true">${data.text}</p><div data-invert class="text-motion__invert" aria-hidden="true"><p class="text-motion__text">${data.text}</p></div></div>`
  : `<p data-effect class="text-motion__text">${data.text}</p>`;
const html = `<div class="text-motion text-motion--${props.id}" style="height:500px;--motion-height:500px">${isScroll ? `<div class="text-motion__scroller" tabindex="0" aria-label="捲動逐字點亮"><div class="text-motion__runway"><div class="text-motion__sticky">${content}</div></div></div>` : `<div class="text-motion__stage">${content}</div>`}</div>`;
const code = `import { createEffect } from './${props.id}.js';\nconst effect = createEffect({ element: document.querySelector('[data-effect]')${isScroll ? ", scroller: document.querySelector('.text-motion__scroller')" : ''} });\n${isScroll ? '// 捲動容器會同步更新效果進度。' : "if (matchMedia('(prefers-reduced-motion: reduce)').matches) effect.timeline.pause().progress(0);\nelse effect.timeline.play();"}\n// 卸載時：effect.destroy();`;
const usage = { title: '使用方式', description: `${data.description} 引入 GSAP 與下方 CSS；效果本體不含列表循環模擬。`, currentLabel: '目前初始化', examples: [{ label: 'HTML', code: html }, { label: 'JavaScript / ESM', code }, { label: 'CSS', code: css }], parameters: [{ name: 'element', description: '效果元素；文字內容取自元素本身。斜線反轉需要內層 data-invert。' }, { name: 'timeline', description: 'GSAP 時間軸，可播放、暫停、反向或設定 progress(0–1)。' }, ...(isScroll ? [{ name: 'scroller', description: '可捲動容器；省略時由外部直接控制時間軸，不自動播放。容器改變尺寸會重新計算。' }] : []), { name: 'destroy()', description: '移除時間軸、監聽器與觀察器，還原原始內容。' }] };
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info><EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="{eyebrow:`JS Effect · ${data.number}`,title:data.title,summary:data.summary}" :usage="usage" :current-code="code" :download-href="sources[`../scripts/${id}.js`]" :download-filename="`${id}.js`" /></template>
    <template #toolbar><EffectPreviewToolbar @replay="scene?.restart()" /></template>
    <template #preview><TextMotion ref="scene" :id="id" /></template>
  </EffectShowcaseLayout>
</template>
