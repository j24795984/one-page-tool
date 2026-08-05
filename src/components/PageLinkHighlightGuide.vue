<script setup>
import { computed, ref } from 'vue';
import guideData from '../data/js-effects/page-link-highlight.json';
import pageLinkFocusDownloadUrl from '../scripts/pageLinkFocus.js?url';
import '../styles/page-link-highlight.css';

const props = defineProps({
  baseUrl: {
    type: String,
    required: true
  },
  initialId: {
    type: String,
    default: 'shopline'
  },
  groupId: {
    type: String,
    default: ''
  }
});

const groups = guideData.groups || [];
const matchedGroups = props.groupId
  ? groups.filter((group) => group.id === props.groupId)
  : groups;
const visibleGroups = matchedGroups.length ? matchedGroups : groups;
const options = computed(() => visibleGroups.flatMap((group) => group.options));
const selectedId = ref(
  options.value.some((option) => option.id === props.initialId)
    ? props.initialId
    : options.value[0]?.id || ''
);
const selectedOption = computed(() => (
  options.value.find((option) => option.id === selectedId.value) || options.value[0]
));
</script>

<template>
  <main class="page-link-guide">
    <aside class="page-link-guide__sidebar">
      <a class="page-link-guide__back" :href="`${baseUrl}js-effects/`">← 返回 JS 效果</a>

      <p class="page-link-guide__eyebrow">Architecture Guide</p>
      <h1>Page Link<br>Highlight</h1>
      <a
        v-if="groupId === 'fallback'"
        class="page-link-guide__download"
        :href="pageLinkFocusDownloadUrl"
        download="pageLinkFocus.js"
      >
        JS 下載
        <span aria-hidden="true">↓</span>
      </a>
      <p class="page-link-guide__summary">{{ guideData.info.summary }}</p>

      <nav class="page-link-guide__choices" aria-label="Top Menu Highlight 架構選擇">
        <section v-for="group in visibleGroups" :key="group.id">
          <div class="page-link-guide__group-heading">
            <p class="page-link-guide__group-title">{{ group.label }}</p>
            <p>{{ group.description }}</p>
          </div>

          <button
            v-for="option in group.options"
            :key="option.id"
            type="button"
            :aria-pressed="selectedId === option.id"
            @click="selectedId = option.id"
          >
            <span>{{ option.label }}</span>
            <small>{{ option.short }}</small>
            <em v-if="option.badge">{{ option.badge }}</em>
          </button>
        </section>
      </nav>
    </aside>

    <section class="page-link-guide__stage" aria-live="polite">
      <header class="page-link-guide__stage-header">
        <div>
          <p>{{ selectedOption.category }}</p>
          <h2>{{ selectedOption.title }}</h2>
        </div>
        <span>{{ selectedOption.rendering }}</span>
      </header>

      <div class="page-link-guide__content">
        <p class="page-link-guide__lead">{{ selectedOption.summary }}</p>

        <dl class="page-link-guide__facts">
          <div>
            <dt>狀態來源</dt>
            <dd>{{ selectedOption.source }}</dd>
          </div>
          <div>
            <dt>更新時機</dt>
            <dd>{{ selectedOption.lifecycle }}</dd>
          </div>
          <div>
            <dt>建議定位</dt>
            <dd>{{ selectedOption.recommendation }}</dd>
          </div>
        </dl>

        <ul class="page-link-guide__notes">
          <li v-for="note in selectedOption.notes" :key="note">{{ note }}</li>
        </ul>

        <section class="page-link-guide__code-section" aria-label="範例建構程式碼">
          <div class="page-link-guide__code-heading">
            <div>
              <p>Construction example</p>
              <h3>範例建構程式碼</h3>
            </div>
            <span>架構示意，不執行效果</span>
          </div>

          <article v-for="sample in selectedOption.samples" :key="sample.label">
            <header>
              <span>{{ sample.label }}</span>
              <code>{{ sample.language }}</code>
            </header>
            <pre><code>{{ sample.code }}</code></pre>
          </article>
        </section>
      </div>
    </section>
  </main>
</template>
