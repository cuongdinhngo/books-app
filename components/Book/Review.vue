<template>
  <div class="border-b pb-4">
    <div class="flex items-center">
        <span class="text-gray-800 font-medium mr-2">
          {{ review.readers.fullName}}
        </span>
        <BookStarRating
          :rating="review.rating"
        />
    </div>
    <p class="text-gray-700 mt-1 text-sm">{{ review.content }}</p>
    <p class="text-gray-400 text-sm">Posted on {{ useDateFormat(review.created_at, 'YYYY-MM-DD') }}</p>
</div>
</template>
<script setup lang="ts">
const props = defineProps({
  review: {
    type: Object,
    required: true
  }
});
</script>