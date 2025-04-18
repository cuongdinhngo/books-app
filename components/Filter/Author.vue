<template>
  <USelectMenu
    v-model="authors"
    :items="items"
    value-key="id"
    multiple
    variant="none"
    placeholder="Select author"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</template>

<script setup>
const authors = defineModel({
  type: Array
});
const { index } = useAuthors();
const items = ref([]);

onMounted(async() => {
  const { data } = await index({ columns: 'id, label:full_name' });
  items.value = data;
});
</script>