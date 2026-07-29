<script setup>
import EffectPreviewPanel from './EffectPreviewPanel.vue';
import '../styles/effect-showcase.css';
</script>

<template>
  <main class="effect-showcase">
    <aside class="effect-showcase__panel effect-showcase__info">
      <slot name="info" />
    </aside>

    <EffectPreviewPanel>
      <slot name="preview" />
    </EffectPreviewPanel>

    <aside class="effect-showcase__panel effect-showcase__controls">
      <div class="effect-showcase__controls-inner">
        <slot name="controls" />
      </div>
    </aside>
  </main>
</template>
