<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  code: { type: String, required: true },
  label: { type: String, default: '程式碼' }
});
const status = ref('');
watch(() => props.code, () => { status.value = ''; });

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    status.value = '已複製';
  } catch {
    status.value = '無法複製，請手動選取程式碼。';
  }
}
</script>

<template>
  <span class="code-copy">
    <button type="button" :aria-label="`複製${label}`" @click="copy">複製</button>
    <span class="code-copy__status" role="status">{{ status }}</span>
  </span>
</template>

<style scoped>
.code-copy { display:inline-flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; gap:6px; }
.code-copy button { padding:4px 8px; border:1px solid var(--border); border-radius:8px; background:var(--surface-card); color:var(--accent); font:inherit; font-size:14px; cursor:pointer; }
.code-copy button:hover { background:var(--surface-selected); border-color:var(--accent); }
.code-copy button:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
.code-copy__status { color:var(--text-secondary); font-size:14px; }
.code-copy__status:empty { display:none; }
</style>
