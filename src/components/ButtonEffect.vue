<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { buttonEffects } from '../data/button-effects.js';
import { initButtonEffect } from '../scripts/button-effects.js';
import { initInteractionSimulation } from '../scripts/interaction-simulation.js';
import { initInteractivePreview } from '../scripts/interactive-preview.js';
import '../styles/button-effects.css';
const props=defineProps({id:String,preview:Boolean,running:{type:Boolean,default:true}});
const root=ref(null);
const effect=buttonEffects.find(item=>item.id===props.id);
let controller;
onMounted(()=>{controller=initInteractivePreview({root:root.value,preview:props.preview,running:props.running,simulate:effect=>initInteractionSimulation({root:root.value,kind:props.id,controls:effect.controls}),create:options=>initButtonEffect({root:root.value,...options})});});
watch(()=>props.running,value=>controller?.setRunning(value));
onBeforeUnmount(()=>controller?.destroy());
</script>
<template>
  <div ref="root" class="button-effect-stage" :class="{'button-effect-stage--preview':preview}" :data-button-effect="id" v-html="effect.html"></div>
</template>
