<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: '效果展示'
  }
});
</script>

<template>
  <section class="effect-showcase__stage" :aria-label="ariaLabel">
    <slot />
  </section>
</template>
