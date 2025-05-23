<template>
  <NuxtLink :to="{ name: 'book-id', params: { id: book?.id }, query: { category: book?.categories.map(c => c.id) } }">  
    <div class="bg-white p-4 rounded-lg shadow text-stone-900 h-[340px]">
      <img :src="`${book?.coverImage}`" :alt="book?.title" class="w-full h-48 object-scale-down mb-2">
      <div class="flex-grow">
        <p class="font-bold line-clamp-2">{{ book?.title }}</p>
        <p class="text-sm text-gray-600 line-clamp-1">
          Author: {{ book?.authors.map(a => a.name).join(', ') }}
        </p>
        <p class="text-sm line-clamp-1">
          Publisher: {{ book?.publishers.map(p => p.name).join(', ') }}
        </p>
        <p class="text-sm line-clamp-1">
          Categories: {{ book?.categories.map(c => c.name).join(', ') }}
        </p>
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