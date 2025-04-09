<template>
  <USelectMenu
    v-model="publishers"
    value-key="id"
    :items="items"
    variant="none"
    multiple
    placeholder="Select publishers"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const { getPublishersFilter } = usePublishers();
const items = ref([]);
const publishers = ref('')

// onMounted(async() => {
//   items.value = await getPublishersFilter();
// });
</script>