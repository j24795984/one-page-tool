<script setup>
const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['apply', 'select-choice', 'update-setting']);

function updateField(field, event) {
  let value = event.target.value;

  if (field.type === 'checkbox') {
    value = event.target.checked;
  } else if (field.type === 'number' && value !== '') {
    value = event.target.valueAsNumber;
  }

  emit('update-setting', { key: field.key, value });
}

function selectChoice(choice) {
  emit('select-choice', {
    key: props.config.choiceKey || 'direction',
    value: choice.value
  });
}

function isFieldVisible(field) {
  if (!field.showWhen) return true;

  return props.modelValue[field.showWhen.key] === field.showWhen.value;
}

function hasVisibleFields() {
  return props.config.fields?.some(isFieldVisible);
}
</script>

<template>
  <p class="effect-controls__title">{{ config.title }}</p>

  <form class="effect-controls__form" @submit.prevent="emit('apply')">
    <div class="effect-controls__choices">
      <button
        v-for="choice in config.choices"
        :key="choice.value"
        class="effect-controls__choice"
        type="button"
        :aria-pressed="modelValue[config.choiceKey || 'direction'] === choice.value"
        @click="selectChoice(choice)"
      >
        {{ choice.label }}
        <span class="effect-controls__choice-note">{{ choice.note }}</span>
      </button>
    </div>

    <fieldset v-if="hasVisibleFields()" class="effect-controls__fields">
      <legend class="effect-controls__fields-title">{{ config.fieldsTitle }}</legend>

      <template v-for="field in config.fields" :key="field.key">
        <label
          v-if="isFieldVisible(field) && field.type === 'checkbox'"
          class="effect-controls__toggle"
        >
          <input
            type="checkbox"
            :checked="modelValue[field.key]"
            @change="updateField(field, $event)"
          >
          <span>{{ field.label }}</span>
        </label>

        <label v-else-if="isFieldVisible(field)" class="effect-controls__field">
          <span>
            {{ field.label }}
            <small v-if="field.unit">{{ field.unit }}</small>
          </span>

          <select
            v-if="field.type === 'select'"
            :value="modelValue[field.key]"
            @change="updateField(field, $event)"
          >
            <option v-for="option in field.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <input
            v-else
            :type="field.type"
            :value="modelValue[field.key]"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            @input="updateField(field, $event)"
          >
        </label>
      </template>
    </fieldset>

    <button v-if="config.submitLabel" class="effect-controls__apply" type="submit">
      {{ config.submitLabel }}
    </button>
  </form>
</template>
