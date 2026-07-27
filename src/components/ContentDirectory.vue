<script setup>
import '../styles/content-directory.css';
import { useContentDirectory } from '../scripts/use-content-directory.js';

const props = defineProps({
  emptyMessage: {
    type: String,
    default: '目前沒有符合條件的項目。'
  },
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const {
  categories,
  filteredItems,
  query,
  selectedCategory
} = useContentDirectory(() => props.items);
</script>

<template>
  <main class="content-directory">
    <aside class="content-directory__sidebar" aria-label="搜尋與分類">
      <label class="content-directory__label" for="directory-search">搜尋</label>
      <input
        id="directory-search"
        v-model="query"
        class="content-directory__search"
        type="search"
        placeholder="輸入標題或分類"
      >

      <div class="content-directory__categories">
        <p class="content-directory__category-title">分類</p>
        <ul class="content-directory__category-list">
          <li v-for="category in categories" :key="category">
            <button
              class="content-directory__category-button"
              type="button"
              :aria-pressed="selectedCategory === category"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <section aria-live="polite">
      <div class="content-directory__heading">
        <h1 class="content-directory__title">{{ title }}</h1>
        <p class="content-directory__count">{{ filteredItems.length }} 個項目</p>
      </div>

      <ul v-if="filteredItems.length" class="content-directory__list">
        <li
          v-for="item in filteredItems"
          :key="item.href ?? item.title"
          class="content-directory__item"
        >
          <a v-if="item.href" class="content-directory__link" :href="item.href">
            <span>
              <span class="content-directory__item-title">{{ item.title }}</span>
              <span class="content-directory__item-category">{{ item.category }}</span>
            </span>
            <span class="content-directory__arrow" aria-hidden="true">→</span>
          </a>
          <div v-else class="content-directory__link content-directory__link--pending">
            <span>
              <span class="content-directory__item-title">{{ item.title }}</span>
              <span class="content-directory__item-category">{{ item.category }}</span>
            </span>
          </div>
        </li>
      </ul>

      <p v-else class="content-directory__empty">{{ emptyMessage }}</p>
    </section>
  </main>
</template>
