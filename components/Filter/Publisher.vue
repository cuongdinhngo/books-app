<template>
  <USelectMenu
    v-model="publishers"
    :items="items"
    :multiple="multiple"
    value-key="id"
    variant="none"
    placeholder="Select publishers"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [Array, Number],
  },
  multiple: {
    type: Boolean,
    default: true
  },
});
const emit = defineEmits(['update:modelValue']);
const { getPublishersFilter } = usePublishers();

const publishers = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
const items = ref([]);

onMounted(async() => {
  items.value = await getPublishersFilter();
});
</script>