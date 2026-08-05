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
  searchInput,
  submitSearch,
  selectedCategory
} = useContentDirectory(() => props.items);
</script>

<template>
  <main class="content-directory">
    <aside class="content-directory__sidebar" aria-label="搜尋與分類">
      <label class="content-directory__label" for="directory-search">搜尋</label>
      <form class="content-directory__search-form" role="search" @submit.prevent="submitSearch">
        <input
          id="directory-search"
          v-model="searchInput"
          class="content-directory__search"
          type="search"
          placeholder="輸入標題或分類"
        >
        <button class="content-directory__search-button" type="submit">搜尋</button>
      </form>

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
          <div
            class="content-directory__link"
            :class="{ 'content-directory__link--pending': !item.href }"
          >
            <span class="content-directory__item-content">
              <a v-if="item.href" class="content-directory__title-link" :href="item.href">
                <span class="content-directory__item-title">{{ item.title }}</span>
              </a>
              <span v-else class="content-directory__item-title">{{ item.title }}</span>

              <span v-if="item.subtitle" class="content-directory__item-note">
                {{ item.subtitle }}
              </span>

              <button
                v-if="item.category"
                class="content-directory__item-tag"
                type="button"
                :aria-label="`篩選分類：${item.category}`"
                :aria-pressed="selectedCategory === item.category"
                @click="selectedCategory = item.category"
              >
                {{ item.category }}
              </button>
            </span>

            <a
              v-if="item.href"
              class="content-directory__arrow-link"
              :href="item.href"
              :aria-label="`前往 ${item.title}`"
            >
              <span class="content-directory__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </li>
      </ul>

      <p v-else class="content-directory__empty">{{ emptyMessage }}</p>
    </section>
  </main>
</template>
