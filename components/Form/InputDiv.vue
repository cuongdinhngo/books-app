<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ labelName }}</label>
    <input
      class="text-sm w-full border p-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-stone-900"
      v-model="inputModel"
      :placeholder="placeholder"
      :type="type"
      :multiple="multiple"
      @change="handleFileChange"
    >
  </div>
</template>

<script setup>
const props = defineProps({
  labelName: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const inputModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleFileChange = (event) => {
  if (props.type === 'file') {
    const files = event.target.files;
    const result = props.multiple ? Array.from(files) : files[0];
    emit('update:modelValue', result);
    emit('change', result);
  } else {
    emit('update:modelValue', event.target.value);
  }
};

</script>