<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import EffectInfoPanel from './EffectInfoPanel.vue';
import EffectShowcaseLayout from './EffectShowcaseLayout.vue';
import effectData from '../data/js-effects/custom-scrollbar.json';
import customScrollbarAssetUrl from '../scripts/custom-scrollbar.js?url';
import '../styles/custom-scrollbar.css';

const customScrollbarDownloadUrl = customScrollbarAssetUrl.split('?')[0];
const currentCode = `initCustomScrollbar({\n  container, thumb, track\n});`;

defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const container = ref(null);
const track = ref(null);
const thumb = ref(null);
let scrollbar = null;

onMounted(async () => {
  const { initCustomScrollbar } = await import('../scripts/custom-scrollbar.js');
  scrollbar = initCustomScrollbar({
    container: container.value,
    track: track.value,
    thumb: thumb.value
  });
});

onBeforeUnmount(() => {
  scrollbar?.destroy();
});
</script>

<template>
  <EffectShowcaseLayout :back-href="`${baseUrl}ui/`">
    <template #info>
      <EffectInfoPanel
        :back-href="`${baseUrl}ui/`"
        :info="effectData.info"
        :usage="effectData.usage"
        :current-code="currentCode"
        :download-href="customScrollbarDownloadUrl"
        download-filename="custom-scrollbar.js"
      />
      <section class="effect-info__usage"><h2 class="effect-info__usage-title">操作方式</h2><p>使用滾輪或觸控板捲動內容，也可以拖曳右側滑塊控制位置。</p></section>
    </template>

    <template #preview>
      <div class="custom-scrollbar-demo">
        <div class="custom-scrollbar-demo__shell">
          <article ref="container" class="custom-scrollbar-demo__container">
            <div class="custom-scrollbar-demo__content">
              <header class="custom-scrollbar-demo__header">
                <p>{{ effectData.preview.label }}</p>
                <h2>{{ effectData.preview.title }}</h2>
                <span>{{ effectData.preview.intro }}</span>
              </header>

              <section
                v-for="section in effectData.preview.sections"
                :key="section.number"
                class="custom-scrollbar-demo__section"
              >
                <p>{{ section.number }}</p>
                <div>
                  <h3>{{ section.title }}</h3>
                  <span>{{ section.body }}</span>
                </div>
              </section>
            </div>
          </article>

          <div ref="track" class="custom-scrollbar-demo__track">
            <div ref="thumb" class="custom-scrollbar-demo__thumb" />
          </div>
        </div>
      </div>
    </template>

  </EffectShowcaseLayout>
</template>
