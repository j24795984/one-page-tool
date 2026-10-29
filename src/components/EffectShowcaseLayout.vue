<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import '../styles/effect-showcase.css';
defineProps({ backHref: { type: String, required: true } });
const infoOpen = ref(false);
const mobile = ref(false);
const toggleButton = ref(null);
let media;
function syncViewport() { mobile.value = media.matches; if (!mobile.value) infoOpen.value = false; }
function closeInfo() { if (mobile.value && infoOpen.value) { infoOpen.value = false; toggleButton.value?.focus(); } }
onMounted(() => { media = window.matchMedia('(max-width:767px)'); syncViewport(); media.addEventListener('change', syncViewport); });
onBeforeUnmount(() => media?.removeEventListener('change', syncViewport));
</script>
<template>
 <main class="effect-showcase" :class="{ 'effect-showcase--info-open': infoOpen }" @keydown.esc="closeInfo">
  <header class="effect-showcase__mobile-header"><a :href="backHref">← 返回 UI 庫</a></header>
  <div class="effect-showcase__toolbar">
   <slot name="toolbar" />
   <button ref="toggleButton" class="effect-showcase__info-toggle" type="button" :aria-expanded="infoOpen" aria-controls="effect-mobile-info" @click="infoOpen = !infoOpen">效果說明 <svg class="effect-showcase__info-chevron" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
  </div>
  <aside id="effect-mobile-info" class="effect-showcase__info" aria-label="效果說明" :inert="mobile && !infoOpen"><slot name="info" /></aside>
  <section class="effect-showcase__stage" aria-label="效果預覽" :inert="mobile && infoOpen">
   <div class="effect-showcase__viewport"><slot name="preview" /></div>
  </section>
 </main>
</template>
