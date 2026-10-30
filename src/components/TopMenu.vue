<script setup>
defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const categories = [
  { label: '小工具', path: 'tools/' },
  { label: 'UI 庫', path: 'ui/' },
  { label: 'UI 參考網站', path: 'ui-references/' }
];
</script>

<template>
  <header class="border-b border-[#496783]/10 bg-[#f7f7f4]/90 backdrop-blur-md">
    <div class="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:flex-nowrap md:px-8 md:py-0">
      <a
        :href="baseUrl"
        class="flex items-center gap-3 text-[#496783] no-underline"
        aria-label="One Page Tool 首頁"
      >
        <span class="flex size-8 items-center justify-center rounded-lg bg-[#496783] text-sm font-semibold text-white">
          M
        </span>
        <span class="text-sm font-semibold tracking-[0.16em]">ONE PAGE TOOL</span>
      </a>

      <nav class="w-full md:w-auto" aria-label="主要分類">
        <ul class="flex flex-wrap items-center gap-1">
          <li v-for="category in categories" :key="category.path">
            <a
              :href="`${baseUrl}${category.path}`"
              class="block rounded-full px-4 py-2 text-sm font-medium text-[#626971] no-underline transition-colors hover:bg-white/70 hover:text-[#496783] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#496783]"
            >
              {{ category.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
