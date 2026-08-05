<script setup>
import { ref } from 'vue';
import '../styles/content-directory.css';
import '../styles/pattern-directory.css';
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

const activeItem = ref(null);
const {
  categories,
  filteredItems,
  searchInput,
  submitSearch,
  selectedCategory
} = useContentDirectory(() => props.items);

function openDetails(item) {
  activeItem.value = item;
}

function closeDetails() {
  activeItem.value = null;
}
</script>

<template>
  <main class="content-directory pattern-directory" @keydown.esc="closeDetails">
    <aside class="content-directory__sidebar" aria-label="搜尋與分類">
      <label class="content-directory__label" for="pattern-directory-search">搜尋</label>
      <form class="content-directory__search-form" role="search" @submit.prevent="submitSearch">
        <input
          id="pattern-directory-search"
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
          <div class="content-directory__link">
            <span class="content-directory__item-content">
              <span class="content-directory__item-title">{{ item.title }}</span>

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

            <button
              class="content-directory__arrow-link pattern-directory__details-button"
              type="button"
              :aria-label="`查看 ${item.title} 說明`"
              :aria-expanded="activeItem === item"
              aria-controls="pattern-directory-details"
              @click="openDetails(item)"
            >
              <span class="content-directory__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="content-directory__empty">{{ emptyMessage }}</p>
    </section>

    <button
      v-if="activeItem"
      class="pattern-directory__backdrop"
      type="button"
      aria-label="關閉內容說明"
      @click="closeDetails"
    />

    <aside
      id="pattern-directory-details"
      class="pattern-directory__panel"
      :class="{ 'is-open': activeItem }"
      :aria-hidden="!activeItem"
      aria-live="polite"
    >
      <template v-if="activeItem">
        <div class="pattern-directory__actions">
          <button
            class="pattern-directory__close"
            type="button"
            aria-label="關閉內容說明"
            @click="closeDetails"
          >
            <span aria-hidden="true">×</span>
          </button>

          <a
            v-if="activeItem.href"
            class="pattern-directory__demo-link"
            :href="activeItem.href"
          >
            頁面展示
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <p class="pattern-directory__eyebrow">{{ activeItem.category }} / UI Pattern</p>
        <h2 class="pattern-directory__title">{{ activeItem.title }}</h2>
        <p class="pattern-directory__lead">{{ activeItem.subtitle }}</p>

        <div class="pattern-directory__content">
          <div>
            <section class="pattern-directory__section">
              <h3>效果呈現</h3>
              <p>{{ activeItem.description }}</p>
              <p>{{ activeItem.effect }}</p>
            </section>

            <section class="pattern-directory__section">
              <h3>適合情境</h3>
              <p>{{ activeItem.useCase }}</p>
            </section>

            <section class="pattern-directory__section">
              <h3>核心技術</h3>
              <ul class="pattern-directory__technology-list">
                <li v-for="technology in activeItem.technologies" :key="technology">
                  {{ technology }}
                </li>
              </ul>
            </section>
          </div>

          <section class="pattern-directory__section pattern-directory__execution">
            <h3>執行方式</h3>
            <ol class="pattern-directory__step-list">
              <li v-for="step in activeItem.execution" :key="step">
                {{ step }}
              </li>
            </ol>
          </section>
        </div>

      </template>
    </aside>
  </main>
</template>
