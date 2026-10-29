<script setup>
import effectData from '../data/js-effects/parallax.json';
import '../styles/parallax.css';
defineProps({ settings: { type: Object, default: () => effectData.defaults }, interactive: { type: Boolean, default: true } });
const emit = defineEmits(['image-load']);
</script>
<template>
          <section
            v-for="section in effectData.preview.sections"
            :key="section.index"
            class="parallax-demo__section"
          >
            <header class="parallax-demo__section-heading">
              <p>Effect {{ section.index }}</p>
              <h2>{{ section.title }}</h2>
              <span>{{ section.note }}</span>
            </header>

            <div class="parallax-demo__stage">
              <span class="parallax-demo__stage-label">Parallax image demo</span>
              <figure
                class="luxy-el parallax-demo__object"
                :data-speed-y="settings.speedY"
                :data-offset="settings.offset"
              >
                <img
                  :src="section.image"
                  :alt="section.alt"
                  loading="lazy"
                  @load="emit('image-load')"
                />
                <figcaption>
                  <span>Scroll-driven image</span>
                  <a v-if="interactive" :href="section.source" target="_blank" rel="noreferrer">
                    {{ section.credit }} / Unsplash
                  </a>
                  <span v-else>{{ section.credit }} / Unsplash</span>
                </figcaption>
              </figure>
            </div>
          </section>
</template>
