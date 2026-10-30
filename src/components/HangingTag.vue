<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { createEffect } from '../scripts/hanging-tag.js';
import '../styles/hanging-tag.css';
const props = defineProps({ running: { type: Boolean, default: true } });
const root = ref(null), letter = ref('A');
let effect, media, observer, index = 0;
function sync() {
  if (!effect) return;
  if (media.matches) effect.timeline.pause('rest');
  else if (document.hidden || !props.running) effect.timeline.pause();
  else effect.timeline.play();
}
function restart() { index = 0; letter.value = 'A'; effect?.timeline.restart(); sync(); }
onMounted(() => {
  effect = createEffect({ element: root.value });
  effect.timeline.repeat(-1).eventCallback('onRepeat', () => { index = (index + 1) % 4; letter.value = 'ABCD'[index]; });
  media = matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  observer = new ResizeObserver(() => { effect.timeline.invalidate(); sync(); });
  observer.observe(root.value);
  sync();
});
watch(() => props.running, sync);
onBeforeUnmount(() => { observer?.disconnect(); media?.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); effect?.destroy(); });
defineExpose({ restart });
</script>
<template>
  <div ref="root" class="hanging-tag" role="img" aria-label="字母吊牌落下擺動後收回">
    <div data-sway class="hanging-tag__sway" aria-hidden="true"><div data-lift class="hanging-tag__lift"><div data-tag class="hanging-tag__card">{{ letter }}</div></div></div>
  </div>
</template>
