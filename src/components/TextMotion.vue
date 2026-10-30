<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { textEffects } from '../data/text-effects.js';
import '../styles/text-motion.css';
const props = defineProps({ id: String, preview: Boolean, running: { type: Boolean, default: true } });
const data = textEffects.find(item => item.id === props.id);
const root = ref(null), target = ref(null), scroller = ref(null);
const loaders = import.meta.glob('../scripts/{split-invert,scroll-text-reveal,crumble-down,elastic-wave-stretch}.js');
let effect, media, observer, disposed = false;
const isScroll = props.id === 'scroll-text-reveal';
function sync() {
  if (!effect) return;
  if (media.matches) { effect.timeline.pause().progress(isScroll ? 1 : 0); return; }
  if (isScroll && !props.preview) { effect.sync(); return; }
  if (document.hidden || !props.running) effect.timeline.pause();
  else effect.timeline.play();
}
function restart() {
  if (!effect) return;
  if (isScroll && !props.preview) { scroller.value.scrollTop = 0; effect.sync(); }
  else effect.timeline.restart();
  sync();
}
onMounted(async () => {
  const module = await loaders[`../scripts/${props.id}.js`]();
  if (disposed) return;
  effect = module.createEffect({ element: target.value, scroller: !props.preview ? scroller.value : undefined });
  if (props.preview || props.id === 'elastic-wave-stretch' || props.id === 'split-invert') {
    const speed = props.preview ? (props.id === 'split-invert' ? 1.5 : 0.9) : 1;
    effect.timeline.repeat(-1).yoyo(props.preview || props.id !== 'elastic-wave-stretch').repeatDelay(0.3).timeScale(speed);
  }
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  observer = new ResizeObserver(([entry]) => root.value.style.setProperty('--motion-height', `${entry.contentRect.height}px`));
  observer.observe(root.value);
  sync();
});
watch(() => props.running, sync);
onBeforeUnmount(() => { disposed = true; observer?.disconnect(); media?.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync); effect?.destroy(); });
defineExpose({ restart });
</script>
<template>
  <div ref="root" class="text-motion" :class="[`text-motion--${id}`, { 'text-motion--preview': preview }]">
    <div v-if="isScroll && !preview" ref="scroller" class="text-motion__scroller" tabindex="0" role="region" aria-label="捲動以逐字點亮文字">
      <div class="text-motion__runway"><div class="text-motion__sticky"><p ref="target" class="text-motion__text">{{ data.text }}</p><p class="text-motion__hint">向下捲動，逐字點亮 ↓</p></div></div>
    </div>
    <div v-else class="text-motion__stage">
      <div v-if="id === 'split-invert'" ref="target" class="text-motion__stage" role="img" :aria-label="data.text">
        <p class="text-motion__text" aria-hidden="true">{{ data.text }}</p>
        <div data-invert class="text-motion__invert" aria-hidden="true"><p class="text-motion__text">{{ data.text }}</p></div>
      </div>
      <p v-else ref="target" class="text-motion__text">{{ data.text }}</p>
    </div>
  </div>
</template>
