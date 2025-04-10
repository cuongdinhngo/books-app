<template>
<a :href="`/book/${book?.bookId}`">
  <div class="bg-white p-4 rounded-lg shadow text-stone-900">
    <img :src="`${book?.coverImage}`" :alt="book?.title" class="w-full h-48 object-scale-down mb-2">
    <p class="font-bold">{{ book?.title }}</p>
    <p class="text-sm text-gray-600">Author: {{ book?.authors[0]?.name }}</p>
    <p class="text-sm">Publisher: {{ book?.publishers.name }}</p>
    <p class="text-sm">Categories: {{ book?.categories.map(category => category.name).join(', ') }}</p>
  </div>
</a>
</template>

<script setup>
const props = defineProps({
  book: Object
});
</script>