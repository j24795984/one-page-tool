<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch, provide } from 'vue';
import UiPreview from './UiPreview.vue';
import { createPreviewScheduler } from '../scripts/preview-scheduler.js';
import { filterGroups, filterItems, triggerOrder } from '../scripts/ui-library.js';
import { styleOrder } from '../data/ui-styles.js';
import '../styles/ui-showcase-directory.css';
const props = defineProps({ items: { type: Array, required: true } });
const active = ref([]);
const reducedMotion = ref(false);
const suspended = ref(true);
const scheduler = createPreviewScheduler(ids => { active.value = ids; });
provide('preview-controller', { scheduler, active, reducedMotion, suspended });
let reduced;
function configurePreviews() { reducedMotion.value = reduced.matches; suspended.value = document.hidden || reduced.matches; scheduler.configure({ limit: props.items.length, hidden: suspended.value }); }
const query = ref('');
const searchInput = ref('');
function submitSearch() { query.value = searchInput.value.trim(); }
function clearQuery() { query.value = ''; searchInput.value = ''; }
const selections = reactive({ triggers: [], types: [], styles: [], packages: [] });
const options = computed(() => Object.fromEntries(filterGroups.map(({key}) => [key, key === 'styles' ? styleOrder : key === 'triggers' ? triggerOrder.filter(value => props.items.some(item => item.triggers.includes(value))) : [...new Set(props.items.flatMap(item => item[key]))]])));
const filteredItems = computed(() => filterItems(props.items, selections, query.value));
function toggle(key, value) { selections[key] = selections[key].includes(value) ? selections[key].filter(entry => entry !== value) : [...selections[key], value]; }
function clearFilters() { clearQuery(); filterGroups.forEach(({key}) => { selections[key] = []; }); }
function readFilters() {
 const params = new URLSearchParams(window.location.search);
 query.value = params.get('q') ?? '';
 searchInput.value = query.value;
 filterGroups.forEach(({key}) => { selections[key] = [...new Set(params.getAll(key).map(value => key === 'triggers' && value === '懸停' ? 'hover' : value))].filter(value => options.value[key].includes(value)); });
 // Obsolete effect/category filters have no equivalent trigger selection.
 const url = new URL(window.location.href);
 if (params.getAll('triggers').includes('懸停')) {
   url.searchParams.delete('triggers');
   selections.triggers.forEach(value => url.searchParams.append('triggers', value));
 }
 url.searchParams.delete('effects');
 url.searchParams.delete('category');
 window.history.replaceState(window.history.state, '', url);
}
let stopSync;
onMounted(() => {
 reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
 configurePreviews();
 reduced.addEventListener('change', configurePreviews);
 document.addEventListener('visibilitychange', configurePreviews);
 readFilters();
 window.addEventListener('popstate', readFilters);
 stopSync = watch([query, selections], () => {
   const url = new URL(window.location.href);
   url.searchParams.delete('category');
   query.value ? url.searchParams.set('q', query.value) : url.searchParams.delete('q');
   filterGroups.forEach(({key}) => { url.searchParams.delete(key); selections[key].forEach(value => url.searchParams.append(key, value)); });
   window.history.replaceState(window.history.state, '', url);
 }, { deep: true });
});
onBeforeUnmount(() => { reduced?.removeEventListener('change', configurePreviews); document.removeEventListener('visibilitychange', configurePreviews); stopSync?.(); window.removeEventListener('popstate', readFilters); });
</script>
<template>
 <main class="ui-showcase">
  <header class="ui-showcase__intro"><div><p class="ui-showcase__eyebrow">INTERFACE LIBRARY</p><h1>UI 庫</h1><p>找到適合的效果，帶進下一個專案。</p></div><span class="ui-showcase__total">{{ items.length }} 個收藏</span></header>
  <section class="ui-showcase__filter-panel" aria-label="篩選 UI 內容">
   <fieldset v-for="group in filterGroups" :key="group.key" class="ui-showcase__filter-row">
    <legend>{{ group.label }}</legend>
    <div><button v-for="option in options[group.key]" :key="option" type="button" :aria-pressed="selections[group.key].includes(option)" @click="toggle(group.key, option)">{{ option }}</button></div>
   </fieldset>
   <form class="ui-showcase__search" role="search" @submit.prevent="submitSearch">
    <label for="ui-search">關鍵字</label>
    <input id="ui-search" v-model="searchInput" type="search" placeholder="搜尋名稱或說明" />
    <div class="ui-showcase__search-actions">
     <button class="ui-showcase__submit" type="submit">搜尋</button>
     <button class="ui-showcase__clear" type="button" @click="clearFilters">清除</button>
    </div>
   </form>
  </section>
  <div v-if="!filteredItems.length" class="ui-showcase__empty"><h2>沒有符合條件的內容</h2><p>試著移除部分篩選，或換個關鍵字。</p><button type="button" @click="clearFilters">清除</button></div>
  <ul v-else class="ui-showcase__grid">
   <li v-for="item in filteredItems" :key="item.id">
    <article class="showcase-card">
     <UiPreview :item="item" />
     <span class="showcase-card__body">
      <span class="showcase-card__types">{{ item.types.join(' · ') }}</span>
      <strong><a :href="item.href">{{ item.title }}</a></strong><span class="showcase-card__summary">{{ item.summary }}</span>
      <span class="showcase-card__tags">
       <span v-for="effect in item.effects" :key="'effect-' + effect" class="showcase-card__tag showcase-card__tag--effect" :aria-label="'效果：' + effect">{{ effect }}</span>
       <span v-for="pkg in item.packages" :key="'package-' + pkg" class="showcase-card__tag showcase-card__tag--package" :aria-label="'技術：' + pkg">{{ pkg }}</span>
      </span>
     </span>
    </article>
   </li>
  </ul>
 </main>
</template>
