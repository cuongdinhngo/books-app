<template>
  <USelectMenu
    v-model="categories"
    :items="items"
    value-key="id"
    variant="none"
    multiple
    placeholder="Select Categories"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const props = defineProps({
  modelValue: Array
});
const emit = defineEmits(['update:modelValue']);
const { getCategories } = useCategories();

const categories = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
const items = ref([]);

onMounted(async() => {
  items.value = await getCategories({selectColumns: 'id, label:name'});
});
</script>