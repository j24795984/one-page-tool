import { computed, ref, toValue } from 'vue';

const ALL_CATEGORY = '全部';

export function useContentDirectory(items) {
  const query = ref('');
  const selectedCategory = ref(ALL_CATEGORY);

  const categories = computed(() => [
    ALL_CATEGORY,
    ...new Set(toValue(items).map((item) => item.category).filter(Boolean))
  ]);

  const filteredItems = computed(() => {
    const keyword = query.value.trim().toLocaleLowerCase('zh-TW');

    return toValue(items).filter((item) => {
      const matchesCategory =
        selectedCategory.value === ALL_CATEGORY ||
        item.category === selectedCategory.value;
      const matchesKeyword =
        keyword === '' ||
        item.title.toLocaleLowerCase('zh-TW').includes(keyword) ||
        item.category.toLocaleLowerCase('zh-TW').includes(keyword);

      return matchesCategory && matchesKeyword;
    });
  });

  return {
    categories,
    filteredItems,
    query,
    selectedCategory
  };
}
