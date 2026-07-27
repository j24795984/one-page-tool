// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

const assetFileNames = (assetInfo) => {
  const sourceName = assetInfo.name ?? assetInfo.names?.[0] ?? '';

  if (sourceName.endsWith('.css')) {
    return 'assets/style-[name]-[hash].min[extname]';
  }

  return 'assets/file-[name]-[hash][extname]';
};

// https://astro.build/config
export default defineConfig({
  site: 'https://j24795984.github.io',
  base: '/one-page-tool',
  integrations: [vue()],
  build: {
    assets: 'assets',
    inlineStylesheets: 'never'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
      minify: 'oxc',
      cssMinify: 'lightningcss',
      sourcemap: false,
      rolldownOptions: {
        output: {
          assetFileNames,
          chunkFileNames: 'assets/chunk-[name]-[hash].js',
          entryFileNames: 'assets/entry-[name]-[hash].js'
        }
      }
    }
  }
});
