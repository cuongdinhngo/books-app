<template>
  <NuxtLink :to="card.to">
    <div :class="card.class ? card.class : 'bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-primary-50'">
        <p class="text-sm font-medium text-gray-600">{{ card.label }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ card.count }}</p>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
});
</script>