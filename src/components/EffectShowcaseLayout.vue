<script setup>
import { ref } from 'vue';
import EffectPreviewPanel from './EffectPreviewPanel.vue';
import '../styles/effect-showcase.css';

defineProps({
  backHref: {
    type: String,
    required: true,
  },
});

const activePanel = ref(null);

function togglePanel(panel) {
  activePanel.value = activePanel.value === panel ? null : panel;
}

function closePanel() {
  activePanel.value = null;
}
</script>

<template>
  <main class="effect-showcase" @keydown.esc="closePanel">
    <header class="effect-showcase__mobile-header">
      <a class="effect-showcase__mobile-back" :href="backHref">← 返回 JS 效果</a>
    </header>

    <aside
      id="effect-mobile-info"
      class="effect-showcase__panel effect-showcase__info"
      :class="{ 'effect-showcase__panel--mobile-active': activePanel === 'info' }"
    >
      <slot name="info" />
    </aside>

    <EffectPreviewPanel>
      <slot name="preview" />
    </EffectPreviewPanel>

    <button
      v-if="activePanel"
      class="effect-showcase__mobile-backdrop"
      type="button"
      aria-label="關閉內容面板"
      @click="closePanel"
    />

    <aside
      id="effect-mobile-controls"
      class="effect-showcase__panel effect-showcase__controls"
      :class="{ 'effect-showcase__panel--mobile-active': activePanel === 'controls' }"
    >
      <div class="effect-showcase__controls-inner">
        <slot name="controls" />
      </div>
    </aside>

    <nav class="effect-showcase__mobile-menu" aria-label="效果頁面選單">
      <button
        type="button"
        :aria-expanded="activePanel === 'info'"
        aria-controls="effect-mobile-info"
        @click="togglePanel('info')"
      >
        說明
      </button>
      <button
        type="button"
        :aria-expanded="activePanel === 'controls'"
        aria-controls="effect-mobile-controls"
        @click="togglePanel('controls')"
      >
        調整
      </button>
    </nav>
  </main>
</template>
