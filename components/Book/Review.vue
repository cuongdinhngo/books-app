<template>
  <div class="border-b pb-4">
    <div class="flex items-center">
        <span class="text-gray-800 font-medium">{{ review.readers.fullName}}</span>
        <span class="ml-2 text-yellow-500">{{ generateRating(review.rating) }}</span>
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