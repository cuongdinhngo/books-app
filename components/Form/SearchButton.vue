<template>
  <button
    type="submit" 
    class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
  >{{ buttonName }}</button>
</template>

<script setup>
defineProps({
  buttonName: {
    type: String,
    required: true
  }
})
</script>