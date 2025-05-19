<template>
  <USkeleton
    v-for="i in quantity"
    :key="i"
    :class="classValue"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  quantity: {
    type: Number,
    default: 5
  },
  classValue: {
    type: String,
    default: 'h-16 w-full rounded-lg bg-gray-200'
  }
});
</script>