<script setup>
import { computed } from 'vue';
import CodeCopyButton from './CodeCopyButton.vue';

const props = defineProps({
  backHref: {
    type: String,
    required: true
  },
  info: {
    type: Object,
    required: true
  },
  usage: {
    type: Object,
    required: true
  },
  currentCode: {
    type: String,
    default: ''
  },
  downloadHref: {
    type: String,
    default: ''
  },
  downloadFilename: {
    type: String,
    default: 'effect.js'
  }
});
const downloadLabel = computed(() => {
  const extension = props.downloadFilename.split('.').pop().toLowerCase();
  return extension === 'html' ? 'HTML 範例下載' : 'JS 下載';
});
</script>

<template>
  <a class="effect-info__back" :href="backHref">← 返回 UI 庫</a>
  <p class="effect-info__eyebrow">{{ info.eyebrow }}</p>
  <h1 class="effect-info__title">{{ info.title }}</h1>
  <a
    v-if="downloadHref"
    class="effect-info__download"
    :href="downloadHref"
    :download="downloadFilename"
  >
    {{ downloadLabel }}
    <span aria-hidden="true">↓</span>
  </a>
  <p class="effect-info__summary">{{ info.summary }}</p>

  <section class="effect-info__usage" aria-labelledby="effect-usage-title">
    <h2 id="effect-usage-title" class="effect-info__usage-title">{{ usage.title }}</h2>
    <p>{{ usage.description }}</p>

    <h3 class="effect-info__section-title">{{ usage.examplesTitle || '引入方式' }}</h3>
    <div class="effect-info__examples">
      <div v-for="example in usage.examples" :key="example.label">
        <div class="effect-info__code-heading">
          <p class="effect-info__example-label">{{ example.label }}</p>
          <CodeCopyButton :code="example.code" :label="example.label" />
        </div>
        <pre class="effect-info__code"><code>{{ example.code }}</code></pre>
      </div>
    </div>

    <h3 v-if="usage.parameters?.length" class="effect-info__section-title">{{ usage.parametersTitle || '控制項目' }}</h3>
    <dl v-if="usage.parameters?.length" class="effect-info__parameter-list">
      <div v-for="parameter in usage.parameters" :key="parameter.name">
        <dt>{{ parameter.name }}</dt>
        <dd>{{ parameter.description }}</dd>
      </div>
    </dl>
  </section>

  <div v-if="currentCode" class="effect-info__current">
    <div class="effect-info__code-heading">
      <p class="effect-info__example-label">{{ usage.currentLabel }}</p>
      <CodeCopyButton :code="currentCode" :label="usage.currentLabel || '目前設定'" />
    </div>
    <code class="effect-info__current-code">{{ currentCode }}</code>
  </div>
</template>
