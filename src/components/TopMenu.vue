<script setup>
defineProps({
  baseUrl: {
    type: String,
    required: true
  }
});

const categories = [
  { label: '小工具', path: 'tools/' },
  { label: 'JS 效果', path: 'js-effects/' }
];
</script>

<template>
  <header class="border-b border-[#314d74]/10 bg-[#f5f1ea]/90 backdrop-blur-md">
    <div class="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
      <a
        :href="baseUrl"
        class="flex items-center gap-3 text-[#314d74] no-underline"
        aria-label="One Page Tool 首頁"
      >
        <span class="flex size-8 items-center justify-center rounded-lg bg-[#314d74] text-sm font-semibold text-white">
          M
        </span>
        <span class="text-sm font-semibold tracking-[0.16em]">ONE PAGE TOOL</span>
      </a>

      <nav aria-label="主要分類">
        <ul class="flex items-center gap-1">
          <li v-for="category in categories" :key="category.path">
            <a
              :href="`${baseUrl}${category.path}`"
              class="block rounded-full px-4 py-2 text-sm font-medium text-[#5f7189] no-underline transition-colors hover:bg-white/70 hover:text-[#314d74] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#314d74]"
            >
              {{ category.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
