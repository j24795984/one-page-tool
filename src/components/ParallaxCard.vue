<script setup>
import { ref, watch, onMounted, onBeforeUnmount, inject } from 'vue';
import ParallaxContent from './ParallaxContent.vue';
import effectData from '../data/js-effects/parallax.json';
const props = defineProps({ running: Boolean });
const emit = defineEmits(['complete', 'error']);
const frame = ref(null);
const { suspended } = inject('preview-controller');
const scroller = ref(null);
const content = ref(null);
const scale = ref(1);
let observer, stopWatch, effect, timeline;
let revision = 0;
let settled = false;
function cleanup() { timeline?.kill(); effect?.destroy(); timeline = null; effect = null; }
function refresh() { effect?.refresh(); }
async function start() {
  const current = ++revision;
  if (!props.running && settled && !suspended.value) return;
  if (!props.running) { cleanup(); settled = false; return; }
  if (settled && timeline) { settled = false; timeline.restart(); return; }
  try {
    const [{ GsapParallax }, { gsap }] = await Promise.all([import('../scripts/parallax.js'), import('gsap')]);
    if (current !== revision) return;
    cleanup(); settled = false;
    scroller.value.scrollTop = 0;
    effect = new GsapParallax();
    effect.init({ root: content.value, scroller: scroller.value, ...effectData.defaults });
    timeline = gsap.timeline({ onComplete: () => { settled = true; emit('complete'); } })
      .to(scroller.value, { scrollTop: () => scroller.value.scrollHeight - scroller.value.clientHeight, duration: 2, ease: 'power1.inOut', repeat: 1, yoyo: true, repeatDelay: 0.3 }, 0.2)
      .to({}, { duration: 0.3 });
  } catch { if (current === revision) { cleanup(); emit('error'); } }
}
onMounted(() => {
  observer = new ResizeObserver(([entry]) => { scale.value = entry.contentRect.width / 800; refresh(); });
  observer.observe(frame.value);
  stopWatch = watch([() => props.running, suspended], start, { immediate: true });
});
onBeforeUnmount(() => { ++revision; observer?.disconnect(); stopWatch?.(); cleanup(); });
</script>
<template>
  <div ref="frame" class="parallax-card">
    <div ref="scroller" class="parallax-card__scroller" :style="{ transform: `scale(${scale})` }">
      <div ref="content" class="parallax-demo__content">
        <ParallaxContent :interactive="false" @image-load="refresh" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.parallax-card { position:absolute; inset:0; overflow:hidden; }
.parallax-card__scroller { width:800px; height:500px; overflow:hidden; transform-origin:top left; }
.parallax-card :deep(.parallax-demo__section-heading), .parallax-card :deep(.parallax-demo__stage-label) { display:none; }
.parallax-card :deep(.parallax-demo__stage) { min-height:800px; padding:64px 56px; }
.parallax-card :deep(.parallax-demo__object) { width:min(82%,704px); }
.parallax-card :deep(.parallax-demo__object img) { height:auto; }
.parallax-card :deep(.parallax-demo__object figcaption span) { font-size:12px; }
</style>
