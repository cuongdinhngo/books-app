<template>
  <USelectMenu
    v-model="categories"
    value-key="id"
    :items="items"
    variant="none"
    multiple
    placeholder="Select category"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const props = defineProps({
  modelValue: Array
});
const emit = defineEmits(['update:modelValue'])

const { getCategoriesFilter } = useCategories();
const items = ref([]);
const categories = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// onMounted(async() => {
//   items.value = await getCategoriesFilter();
// });
</script>