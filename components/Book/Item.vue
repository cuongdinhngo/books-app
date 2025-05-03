<template>
  <NuxtLink :to="`/book/${book?.id}`">
    <div class="bg-white p-4 rounded-lg shadow text-stone-900 h-[340px]">
      <img :src="`${book?.coverImage}`" :alt="book?.title" class="w-full h-48 object-scale-down mb-2">
      <div class="flex-grow">
        <p class="font-bold line-clamp-2">{{ book?.title }}</p>
        <p class="text-sm text-gray-600">Author: {{ book?.authors?.map(author => author.name).join(', ') || 'unknown' }}</p>
        <p class="text-sm">Publisher: {{ book?.publishers.map(publisher => publisher.name).join(', ') || 'unknown' }}</p>
        <p class="text-sm">Categories: {{ book?.categories.map(category => category.name).join(', ') || 'unknown' }}</p>
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