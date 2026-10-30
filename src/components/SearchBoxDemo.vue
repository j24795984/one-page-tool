<script setup>
import SearchBox from './SearchBox.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import source from '../scripts/search-box.js?url';
import css from '../styles/search-box.css?raw';
const props = defineProps({ variant:String, baseUrl:String });
const title = props.variant === 'morph' ? '放大鏡搜尋框 Morph Search' : '展開搜尋框 Expand Search';
const html = `<div class="search-stage" style="height:400px"><form class="search-motion search-motion--${props.variant}" role="search"><button data-open type="button" aria-label="展開搜尋" aria-expanded="false">${props.variant === 'expand' ? '搜尋' : ''}</button><div data-field inert aria-hidden="true"><input type="search" aria-label="搜尋關鍵字" placeholder="搜尋關鍵字"><button data-submit type="submit" aria-label="搜尋"><i class="search-glass" aria-hidden="true"></i></button></div></form><span data-outside aria-hidden="true"></span></div>`;
const code = "import { initSearchBox } from './search-box.js';\nconst effect = initSearchBox({ root: document.querySelector('.search-motion') });\n// 卸載時：effect.destroy();";
const usage = { title:'使用方式',description:'CSS Keyframes 負責尺寸回彈與圖示動畫，原生 JS 管理點擊、焦點及 CSS 動畫反向播放。點擊展開、點擊外部或 Esc 收合；保留輸入文字。搜尋按鈕僅示範，不送出查詢。',currentLabel:'目前初始化',examples:[{label:'HTML',code:html},{label:'JavaScript / ESM',code},{label:'CSS',code:css}],parameters:[{name:'root',description:'搜尋表單根元素，含 data-open、data-field 與 input。'},{name:'setRunning(boolean)',description:'控制搜尋框及子元素動畫播放狀態。'},{name:'destroy()',description:'清除點擊、鍵盤、表單及背景監聽。'}] };
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info><EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="{eyebrow:'UI Effect',title,summary:'點擊展開輸入，點擊外部收合，保留搜尋內容。'}" :usage="usage" :current-code="code" :download-href="source.split('?')[0]" download-filename="search-box.js" /></template>
    <template #preview><SearchBox :variant="variant" /></template>
  </EffectShowcaseLayout>
</template>

