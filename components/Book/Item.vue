<template>
  <div class="bg-white p-4 rounded-lg shadow text-stone-900">
    <img :src="`${photoPath}${book?.cover_image}`" :alt="book?.title" class="w-full h-48 object-cover mb-2">
    <p class="text-sm text-gray-600">Author: {{ book?.author_full_name }}</p>
    <p class="font-bold">{{ book?.title }}</p>
    <p class="text-sm">Qty: {{ book?.quantity }}</p>
    <p class="text-sm">Bought: 2023-09-01</p>
  </div>
</template>

<script setup>
const props = defineProps({
  book: Object
});

const { photoPath } = useSettings();
</script>