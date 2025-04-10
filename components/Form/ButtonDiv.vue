<template>
  <div class="flex justify-between gap-4">
    <button
      type="submit" 
      class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
    >
      {{ label }}
    </button>
  </div> 
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
    default: 'Add new'
  }
});
</script>