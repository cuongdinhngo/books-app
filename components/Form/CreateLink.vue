<template>
  <NuxtLink
    :to="link" 
    class="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 text-center"
  >
    {{ name }}
  </NuxtLink>
</template>

<script setup>
import { NuxtLink } from '#components';

defineProps({
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});
</script>