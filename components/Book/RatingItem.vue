<template>
  <NuxtLink :to="`/book/${book?.book_id}`">
    <div class="bg-white p-4 rounded-lg shadow text-stone-900 h-[320px]">
      <img :src="`${book?.book_image}`" :alt="book?.book_title" class="w-full h-48 object-scale-down mb-2">
      <p class="font-bold line-clamp-2">{{ book?.book_title }}</p>
      <p
        v-if="book.average_rating"
        class="text-sm text-gray-600"
      >
        Rating:
        <span class="text-yellow-400">{{ generateRating(book.average_rating) }}</span>
      </p>

      <p
        v-if="book.rating_count"
        class="text-sm"
      >
        Total reviews: {{ book.rating_count }}
      </p>

      <p
        v-if="book.total_orders"
        class="text-sm"
      >
        Total orders: {{ book.total_orders }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});
</script>