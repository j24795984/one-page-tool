<script setup>
import { computed, ref } from 'vue';
import '../styles/ui-showcase-directory.css';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const selectedCategory = ref('全部');
const categories = computed(() => [
  '全部',
  ...new Set(props.items.map((item) => item.category))
]);
const filteredItems = computed(() => (
  selectedCategory.value === '全部'
    ? props.items
    : props.items.filter((item) => item.category === selectedCategory.value)
));
</script>

<template>
  <main class="ui-showcase">
    <header class="ui-showcase__intro">
      <p class="ui-showcase__eyebrow">UI SHOWCASE</p>
      <h1>純 UI 展示</h1>
      <p>每個項目聚焦一個效果；高度相關的實作方式則收在同一組展示中。</p>
    </header>

    <nav class="ui-showcase__filters" aria-label="UI 展示分類">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :aria-pressed="selectedCategory === category"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </nav>

    <p class="ui-showcase__count" aria-live="polite">
      {{ filteredItems.length }} 個展示
    </p>

    <ul class="ui-showcase__grid">
      <li v-for="item in filteredItems" :key="item.href">
        <a class="showcase-card" :href="item.href">
          <span
            class="showcase-card__preview"
            :data-preview="item.preview"
            aria-hidden="true"
          >
            <span v-for="index in 6" :key="index" class="showcase-card__shape" />
          </span>

          <span class="showcase-card__body">
            <span class="showcase-card__meta">
              <span>{{ item.category }}</span>
              <span v-if="item.variants">{{ item.variants }} 種實作</span>
            </span>
            <strong>{{ item.title }}</strong>
            <span class="showcase-card__tags">
              <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
            </span>
          </span>
        </a>
      </li>
    </ul>
  </main>
</template>
