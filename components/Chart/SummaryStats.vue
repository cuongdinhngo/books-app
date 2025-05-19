<template>
  <div>
    <p
      v-for="item in data"
      :key="item.name"
      class="flex items-center gap-2"
    >
      <span 
        class="inline-block w-3 h-3 rounded-full" 
        :style="{ backgroundColor: getItemColor(item) }"
      ></span>
      <NuxtLink
        :to="labels.find(label => label.id === item.id)?.to"
        :class="linkClass"
      >
        {{ item.name }}: {{ item.value }}
      </NuxtLink>
    </p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    default: [],
    required: true
  },
  labels: {
    type: Array,
    default: [],
    required: true
  },
  linkClass: {
    type: String,
    default: 'text-stone-800 hover:text-primary-500'
  }
});

const getItemColor = (item) => {
  console.log('item', item);
  const label = props.labels.find(label => label.id === item.id);
  return label?.color || '#cccccc';
};
</script>