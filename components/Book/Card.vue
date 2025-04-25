<template>
  <div class="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full">
    <NuxtLink :to="`/book/${book.id}`">
      <img
        :src="book.coverImage"
        alt="Book Cover"
        class="w-full h-64 object-cover rounded-md mb-4"
      >
    </NuxtLink>
    <div class="flex flex-col">
      <h2 class="text-lg font-semibold text-gray-800 truncate">{{ book.title }}</h2>
      <p class="text-sm text-gray-600 text-right">Status: {{book.status}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});
</script>