<template>
  <NuxtLink :to="{ name: 'book-id', params: { id: book?.id }, query: { category: book?.categories.map(c => c.id) } }">  
    <div class="bg-white p-4 rounded-lg shadow text-stone-900 h-[340px]">
      <img :src="`${book?.coverImage}`" :alt="book?.title" class="w-full h-48 object-scale-down mb-2">
      <div class="flex-grow">
        <p class="font-bold line-clamp-2">{{ book?.title }}</p>
        <p class="text-sm text-gray-600">Author: {{ book?.authors.length > 1 ? `${book?.authors[0].name}, ...` : book?.authors[0].name }}</p>
        <p class="text-sm">Publisher: {{ book?.publishers.length > 1 ? `${book.publishers[0].name}, ...` : book.publishers[0].name }}</p>
        <p class="text-sm">Categories: {{ book?.categories.length > 1 ? `${book?.categories[0].name} & ...` : book?.categories[0].name }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});
</script>