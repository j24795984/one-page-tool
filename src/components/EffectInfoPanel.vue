<script setup>
defineProps({
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
</script>

<template>
  <a class="effect-info__back" :href="backHref">← 返回 JS 效果</a>
  <p class="effect-info__eyebrow">{{ info.eyebrow }}</p>
  <h1 class="effect-info__title">{{ info.title }}</h1>
  <a
    v-if="downloadHref"
    class="effect-info__download"
    :href="downloadHref"
    :download="downloadFilename"
  >
    JS 下載
    <span aria-hidden="true">↓</span>
  </a>
  <p class="effect-info__summary">{{ info.summary }}</p>

  <section class="effect-info__usage" aria-labelledby="effect-usage-title">
    <h2 id="effect-usage-title" class="effect-info__usage-title">{{ usage.title }}</h2>
    <p>{{ usage.description }}</p>

    <div class="effect-info__examples">
      <div v-for="example in usage.examples" :key="example.label">
        <p class="effect-info__example-label">{{ example.label }}</p>
        <pre class="effect-info__code"><code>{{ example.code }}</code></pre>
      </div>
    </div>

    <dl v-if="usage.parameters?.length" class="effect-info__parameter-list">
      <div v-for="parameter in usage.parameters" :key="parameter.name">
        <dt>{{ parameter.name }}</dt>
        <dd>{{ parameter.description }}</dd>
      </div>
    </dl>
  </section>

  <div v-if="currentCode" class="effect-info__current">
    <p class="effect-info__example-label">{{ usage.currentLabel }}</p>
    <code class="effect-info__current-code">{{ currentCode }}</code>
  </div>
</template>
