<template>
  <div
    id="photo-frame" 
    class="w-60 h-80 bg-gray-100 border-2 border-solid border-gray-400 rounded-lg shadow flex items-center justify-center overflow-hidden"
  >
    <img
      v-if="imagePreview"
      :src="imagePreview"
      alt="Photo Preview" 
      class="max-w-full h-auto rounded-lg shadow"
    />
    <span v-else id="placeholder-text" class="text-gray-500 text-sm">No Photo Selected</span>
  </div>
</template>

<script setup>
defineProps({
  imagePreview: {
    type: String,
    require: true
  }
});
</script>