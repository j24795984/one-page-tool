<script setup>
defineProps({ config: { type: Object, default: () => ({}) }, modelValue: { type: Object, default: () => ({}) }, replay: { type: Boolean, default: true }, disabled: Boolean });
const emit = defineEmits(['replay','select-choice']);
</script>
<template>
 <div v-if="config.choices?.length" class="effect-toolbar__versions" role="group" aria-label="展示版本">
  <button v-for="choice in config.choices" :key="choice.value" type="button" :aria-pressed="modelValue[config.choiceKey || 'direction'] === choice.value" @click="emit('select-choice', {key: config.choiceKey || 'direction', value: choice.value})">{{ choice.label }}</button>
 </div>
 <button v-if="replay" type="button" :disabled="disabled" @click="emit('replay')">↻ 重新播放</button>
</template>
