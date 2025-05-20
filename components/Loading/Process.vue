<template>
  <UProgress
    :color="colorValue"
    :size="sizeValue"
    :animation="animationValue"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  colorValue: {
    type: String,
    default: 'success',
    validator: (value:string) => {
      return ["success", "warning", "error", "info", "primary", "secondary", "neutral"].includes(value);
    }
  },
  sizeValue: {
    type: String,
    default: '2xl',
    validator: (value:string) => {
      return ["xs", "2xs", "sm", "md", "lg", "xl", "2xl"].includes(value);
    }
  },
  animationValue: {
    type: String,
    default: 'carousel',
    validator: (value:string) => {
      return ["carousel", "carousel-inverse", "swing", "elastic"].includes(value);
    }
  }
}); 
</script>