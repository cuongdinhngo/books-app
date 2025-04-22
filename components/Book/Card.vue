<template>
  <div class="bg-white shadow-lg rounded-lg flex overflow-hidden p-5">
    <!-- Left: Book Photo -->
    <div class="w-1/3">
      <img :src="book.coverImage" alt="Book Cover" class="object-contain w-100 h-80">
    </div>
    <!-- Right: Book Details -->
    <div class="w-2/3 p-4 flex flex-col justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-800">{{ book.title }}</h3>
        <p class="text-gray-600">Status: <span class="font-semibold">{{ book.status}}</span></p>
      </div>
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