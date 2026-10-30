<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { initSearchBox } from '../scripts/search-box.js';
import { initInteractivePreview } from '../scripts/interactive-preview.js';
import { initInteractionSimulation } from '../scripts/interaction-simulation.js';
import '../styles/search-box.css';
const props = defineProps({ variant: { type:String, default:'expand' }, preview:Boolean, running:{type:Boolean,default:true} });
const stage = ref(null), root = ref(null);
let effect;
onMounted(() => { effect = initInteractivePreview({ root:stage.value, preview:props.preview, running:props.running, create:options=>initSearchBox({root:root.value,...options}), simulate:controller=>initInteractionSimulation({root:stage.value,kind:'search-box',controls:controller.controls}) }); });
watch(()=>props.running,value=>effect?.setRunning(value));
onBeforeUnmount(()=>effect?.destroy());
</script>
<template>
  <div ref="stage" class="search-stage">
    <form ref="root" class="search-motion" :class="`search-motion--${variant}`" role="search" aria-label="搜尋框互動示範">
      <button data-open type="button" aria-label="展開搜尋" aria-expanded="false"><span v-if="variant === 'expand'">搜尋</span></button>
      <div data-field inert aria-hidden="true"><input type="search" aria-label="搜尋關鍵字" placeholder="搜尋關鍵字"><button data-submit type="submit" aria-label="搜尋（示範）"><i class="search-glass" aria-hidden="true"></i></button></div>
    </form>
    <span data-outside aria-hidden="true"></span>
  </div>
</template>
