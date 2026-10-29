<script setup>
import { ref } from 'vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
const props = defineProps({ item: {type:Object,required:true}, baseUrl: {type:String,required:true} });
const generation = ref(0);
</script>
<template>
 <EffectShowcaseLayout :back-href="baseUrl + 'ui/'">
  <template #info>
   <a class="effect-info__back" :href="baseUrl + 'ui/'">← 返回 UI 庫</a>
   <p class="effect-info__eyebrow">UI PATTERN</p><h1 class="effect-info__title">{{ item.title }}</h1>
   <p class="effect-info__summary">{{ item.description }}</p>
   <section class="effect-info__usage">
    <h2 class="effect-info__usage-title">效果說明</h2><p>{{ item.effect }}</p>
    <h3 class="effect-info__section-title">適用情境</h3><p>{{ item.useCase }}</p>
    <h3 class="effect-info__section-title">引入方式</h3><p>{{ item.introduction }}</p>
    <ol><li v-for="step in item.execution" :key="step">{{ step }}</li></ol>
    <h3 class="effect-info__section-title">控制項目</h3>
    <dl class="effect-info__parameter-list">
     <div v-for="parameter in item.parameters" :key="parameter.name"><dt>{{ parameter.name }}</dt><dd>{{ parameter.description }}</dd></div>
    </dl>
    <h3 class="effect-info__section-title">使用技術</h3><p>{{ item.technologies.join(' · ') }}</p>
   </section>
  </template>
  <template #toolbar><button type="button" @click="generation++">↻ 重新播放</button><a :href="baseUrl + 'demos/' + item.id + '/'" target="_blank" rel="noopener">開啟獨立展示 ↗</a></template>
  <template #preview><iframe :key="generation" :src="baseUrl + 'demos/' + item.id + '/'" :title="item.title + ' 效果展示'" /></template>
 </EffectShowcaseLayout>
</template>
