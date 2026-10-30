<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { createSlotText } from '../scripts/slot-text.js';
import '../styles/slot-text.css';
const props = defineProps({ preview: Boolean, running: { type: Boolean, default: true } });
const root = ref(null);
let effect, media;
function sync() {
  if (!effect) return;
  if (media.matches) { effect.timeline.pause().progress(1); return; }
  if (document.hidden || !props.running) effect.timeline.pause();
  else effect.timeline.play();
}
function restart() {
  if (!effect) return;
  effect.timeline.restart();
  sync();
}
onMounted(() => {
  effect = createSlotText({ element: root.value });
  if (props.preview) effect.timeline.repeat(-1).yoyo(true).repeatDelay(0.3).timeScale(0.9);
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
});
watch(() => props.running, sync);
onBeforeUnmount(() => { media?.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); effect?.destroy(); });
defineExpose({ restart });
</script>
<template><div class="slot-text-stage" :class="{'slot-text-stage--preview':preview}"><div ref="root" class="slot-text" role="img" aria-label="大吉利">大吉利</div></div></template>
