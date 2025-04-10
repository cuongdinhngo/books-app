<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ labelName }}</label>
    <UInputNumber
      v-model="inputModel"
      :placeholder="placeholder"
      orientation="vertical"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  labelName: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number
  },
  placeholder: {
    type: String
  }
});

const emit = defineEmits(['update:modelValue']);

const inputModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>