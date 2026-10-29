<script setup>
import ButtonEffect from './ButtonEffect.vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import { buttonEffects } from '../data/button-effects.js';
import scriptUrl from '../scripts/button-effects.js?url';
import css from '../styles/button-effects.css?raw';
const props=defineProps({baseUrl:String,id:String});
const effect=buttonEffects.find(item=>item.id===props.id);
const code=`const effect = initButtonEffect({ root: document.querySelector('[data-button-effect="${effect.id}"]') });`;
const info={eyebrow:`${(effect.types ?? ['按鈕']).join(' · ')} · GSAP`,title:effect.title,summary:effect.summary};
const usage={title:'使用方式',description:effect.instructions,examples:[
  {label:'HTML',code:`<div class="button-effect-stage" data-button-effect="${effect.id}">\n${effect.html}\n</div>`},
  {label:'JavaScript / ESM',code:`import { initButtonEffect } from './button-effects.js';\n// 先安裝 gsap 並套用下方 CSS。\n${code}\n// 元件卸載時 effect.destroy();`},
  {label:'CSS',code:css}
],parameters:[
  {name:'root / data-button-effect',description:'傳入單一效果容器；data-button-effect 指定範例種類。多個實例各自初始化與清理。'},
  {name:'running / controls',description:'running 控制執行；controls 提供與原生事件共用的效果操作。自動示範由列表的獨立模擬器負責。'},
  {name:'onConfirm',description:'僅長按確認使用：連續按滿 1.2 秒後呼叫一次，同時送出 confirmed DOM 事件；本頁只展示確認結果。'},
  {name:'動態與鍵盤',description:'填色、箭頭及社群圖示支援鍵盤焦點；漣漪支援 Enter / Space。長按可持續按住 Enter / Space，放開、移出、失焦或 Esc 取消。減少動態偏好停用列表動畫與旋轉，互動直接呈現狀態；長按仍需完整等待。'}
],currentLabel:'目前初始化'};
</script>
<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel :back-href="`${baseUrl}ui/`" :info="info" :usage="usage" :current-code="code" :download-href="scriptUrl.split('?')[0]" download-filename="button-effects.js" />
      <p style="margin-top:24px;font-size:14px">效果參考：<a href="https://kittenjam-motion-library.vercel.app/" target="_blank" rel="noreferrer">Motion Library · {{ effect.number }}</a></p>
    </template>
    <template #preview><ButtonEffect :id="id" /></template>
  </EffectShowcaseLayout>
</template>
