<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { referenceFilterGroups as groups, filterReferences } from '../scripts/ui-references.js';
import '../styles/ui-showcase-directory.css';
import '../styles/ui-reference-directory.css';

const props = defineProps({ items: { type: Array, required: true } });
const baseUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;
const selections = reactive({ styles: [], features: [] });
const query = ref('');
const searchInput = ref('');
const options = computed(() => Object.fromEntries(groups.map(({ key }) => [key, [...new Set(props.items.flatMap(item => item[key]))]])));
const filteredItems = computed(() => filterReferences(props.items, selections, query.value));
function toggle(key, value) {
  selections[key] = selections[key].includes(value) ? selections[key].filter(entry => entry !== value) : [...selections[key], value];
}
function clearFilters() {
  query.value = searchInput.value = '';
  groups.forEach(({ key }) => { selections[key] = []; });
}
function readFilters() {
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('types');
  const allowedFeatures = cleanUrl.searchParams.getAll('features').filter(value => options.value.features.includes(value));
  cleanUrl.searchParams.delete('features');
  allowedFeatures.forEach(value => cleanUrl.searchParams.append('features', value));
  window.history.replaceState(window.history.state, '', cleanUrl);
  const params = cleanUrl.searchParams;
  query.value = searchInput.value = params.get('q') ?? '';
  groups.forEach(({ key }) => { selections[key] = [...new Set(params.getAll(key))].filter(value => options.value[key].includes(value)); });
}
let stopSync;
onMounted(() => {
  readFilters();
  window.addEventListener('popstate', readFilters);
  stopSync = watch([query, selections], () => {
    const url = new URL(window.location.href);
    query.value ? url.searchParams.set('q', query.value) : url.searchParams.delete('q');
    groups.forEach(({ key }) => {
      url.searchParams.delete(key);
      selections[key].forEach(value => url.searchParams.append(key, value));
    });
    window.history.replaceState(window.history.state, '', url);
  }, { deep: true });
});
onBeforeUnmount(() => { stopSync?.(); window.removeEventListener('popstate', readFilters); });
</script>

<template>
  <main class="ui-showcase">
    <header class="ui-showcase__intro">
      <div><p class="ui-showcase__eyebrow">UI REFERENCES</p><h1>UI 參考網站</h1><p>收藏值得觀察的介面與動態展示，從風格與用途找到靈感。</p></div>
      <span class="ui-showcase__total">{{ items.length }} 個網站</span>
    </header>
    <section class="ui-showcase__filter-panel" aria-label="篩選參考網站">
      <fieldset v-for="group in groups" :key="group.key" class="ui-showcase__filter-row">
        <legend>{{ group.label }}</legend>
        <div><button v-for="option in options[group.key]" :key="option" type="button" :aria-pressed="selections[group.key].includes(option)" @click="toggle(group.key, option)">{{ option }}</button></div>
      </fieldset>
      <form class="ui-showcase__search" role="search" @submit.prevent="query = searchInput.trim()">
        <label for="reference-search">關鍵字</label>
        <input id="reference-search" v-model="searchInput" type="search" placeholder="搜尋網站、風格、說明或 AI 提示詞" />
        <div class="ui-showcase__search-actions"><button class="ui-showcase__submit" type="submit">搜尋</button><button class="ui-showcase__clear" type="button" @click="clearFilters">清除</button></div>
      </form>
    </section>
    <div v-if="!filteredItems.length" class="ui-showcase__empty"><h2>沒有符合條件的網站</h2><p>試著移除部分篩選，或換個關鍵字。</p><button type="button" @click="clearFilters">清除</button></div>
    <ul v-else class="reference-grid">
      <li v-for="item in filteredItems" :key="item.id">
        <article class="reference-card">
          <img class="reference-card__image" :src="baseUrl + item.image" :alt="item.title + ' 網站畫面預覽'" width="1265" height="712" loading="lazy" decoding="async" />
          <div class="reference-card__body">
          <p class="reference-card__domain">{{ item.domain }}</p>
          <h2><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }} <span aria-hidden="true">↗</span><span class="reference-sr-only">（在新分頁開啟）</span></a></h2>
          <p class="reference-card__summary">{{ item.summary }}</p>
          <div class="reference-card__tags" aria-label="網站標籤">
            <span v-for="tag in [...new Set([...item.styles, ...item.features])]" :key="tag">{{ tag }}</span>
          </div>
          </div>
        </article>
      </li>
    </ul>
  </main>
</template>
