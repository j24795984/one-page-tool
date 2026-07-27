<script setup>
import '../styles/effect-showcase.css';

defineProps({
  backHref: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    default: 'JS Effect'
  },
  title: {
    type: String,
    required: true
  }
});
</script>

<template>
  <main class="effect-showcase">
    <aside class="effect-showcase__panel effect-showcase__info">
      <a class="effect-showcase__back" :href="backHref">← 返回 JS 效果</a>
      <p class="effect-showcase__eyebrow">{{ eyebrow }}</p>
      <h1 class="effect-showcase__title">{{ title }}</h1>
      <div class="effect-showcase__description">
        <slot name="description" />
      </div>
    </aside>

    <section class="effect-showcase__stage" aria-label="效果展示">
      <slot name="preview" />
    </section>

    <aside class="effect-showcase__panel effect-showcase__controls">
      <div class="effect-showcase__controls-inner">
        <p class="effect-showcase__panel-title">效果選擇</p>
        <slot name="controls" />
      </div>
    </aside>
  </main>
</template>
