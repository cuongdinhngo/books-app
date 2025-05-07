<template>
  <div class="flex items-center">
    <div class="flex">
      <span v-for="index in 5" :key="index" class="inline-block w-5 h-5">
        <!-- Full star -->
        <svg v-if="index <= Math.floor(rating)" class="w-full h-full fill-yellow-400" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <!-- Half star -->
        <svg v-else-if="index === Math.ceil(rating) && rating % 1 !== 0" class="w-full h-full" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stop-color="#facc15"/>
              <stop offset="50%" stop-color="#e5e7eb"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <!-- Empty star -->
        <svg v-else class="w-full h-full fill-gray-300" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      </span>
    </div>
    <span v-if="isShowValue" class="ml-2 text-gray-800">{{ rating.toFixed(1) }}/5</span>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 5
  },
  isShowValue: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* Tailwind is handling most styling, but we can add custom styles if needed */
</style>