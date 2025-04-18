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
const { index } = useCategories();
const categories = defineModel();
const items = ref([]);

onMounted(async() => {
  const { data } = await index({ columns: 'id, label:name' });
  items.value = data;
});
</script>