<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import '../styles/object-fade-active.css';

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const directions = [
  { label: 'Fade Up', value: 'up', note: '由下往上浮現' },
  { label: 'Fade Down', value: 'down', note: '由上往下浮現' },
  { label: 'Fade Left', value: 'left', note: '由右往左浮現' },
  { label: 'Fade Right', value: 'right', note: '由左往右浮現' }
];

const cards = [
  'Discover',
  'Compose',
  'Refine',
  'Deliver',
  'Observe',
  'Repeat'
];

const activeDirection = ref('up');
const previewRoot = ref(null);
const scroller = ref(null);

let cleanupEffect = () => {};
let initEffect;

function restartEffect() {
  if (!initEffect) return;

  cleanupEffect();
  scroller.value.scrollTop = 0;
  cleanupEffect = initEffect({
    direction: activeDirection.value,
    root: previewRoot.value,
    scroller: scroller.value
  });
}

function selectDirection(direction) {
  activeDirection.value = direction;
  restartEffect();
}

onMounted(async () => {
  ({ initObjectFadeActive: initEffect } = await import('../scripts/object-fade-active.js'));
  restartEffect();
});

onBeforeUnmount(() => {
  cleanupEffect();
});
</script>

<template>
  <EffectShowcaseLayout
    :back-href="`${baseUrl}js-effects/`"
    title="Object Fade Active"
  >
    <template #description>
      <p class="object-fade-demo__description-copy">
        當物件進入可視範圍時，以透明度與位移呈現進場效果；回捲離開觸發線後會重置，可重複觀看。
      </p>
      <code class="object-fade-demo__code">data-object-fade</code>
    </template>

    <template #preview>
      <div ref="scroller" class="object-fade-demo">
        <div class="object-fade-demo__intro">
          <div class="object-fade-demo__intro-inner">
            <p class="object-fade-demo__intro-label">Live Preview</p>
            <h2 class="object-fade-demo__intro-title">Scroll to reveal</h2>
            <span class="object-fade-demo__scroll-hint">向下捲動查看效果 ↓</span>
          </div>
        </div>

        <div ref="previewRoot" class="object-fade-demo__grid">
          <article
            v-for="(card, index) in cards"
            :key="card"
            class="object-fade-demo__card"
            data-object-fade
          >
            <span class="object-fade-demo__card-index">0{{ index + 1 }}</span>
            <h3 class="object-fade-demo__card-title">{{ card }}</h3>
          </article>
        </div>
      </div>
    </template>

    <template #controls>
      <div class="object-fade-demo__options">
        <button
          v-for="direction in directions"
          :key="direction.value"
          class="object-fade-demo__option"
          type="button"
          :aria-pressed="activeDirection === direction.value"
          @click="selectDirection(direction.value)"
        >
          {{ direction.label }}
          <span class="object-fade-demo__option-note">{{ direction.note }}</span>
        </button>
      </div>
    </template>
  </EffectShowcaseLayout>
</template>
