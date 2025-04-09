<template>
  <USelectMenu
    placeholder="Select author"
    v-model="authors"
    value-key="id"
    multiple
    :items="items"
    variant="none"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const props = defineProps({
  modelValue: Array
});
const emit = defineEmits(['update:modelValue']);
const { getAuthorsFilter } = useAuthors();


const authors = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
const items = ref([]);

onMounted(async() => {
  items.value = await getAuthorsFilter();
});
</script>