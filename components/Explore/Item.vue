<template>
  <NuxtLink :to="to" class="block">
    <div 
      :class="[
        'bg-white p-4 rounded-lg shadow text-stone-900',
        'hover:shadow-lg hover:text-stone-500 transition-shadow',
        heightItem
      ]"
    >
      <img
        :src="imageUrl"
        :alt="item.name"
        :class="['object-scale-down mb-2', imageSize]"
        loading="lazy"
        decoding="async"
      />
      <p class="font-bold line-clamp-2 text-center">{{ item.name }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  heightItem: {
    type: String,
    default: 'h-[270px]'
  },
  imageSize: {
    type: String,
    default: 'w-full h-48'
  }
});

const queryMap = {
  categories: 'category',
  authors: 'author',
  publishers: 'publisher'
};

const to = computed(() => {
  return {
    name: 'index',
    query: {
      [queryMap[props.type]]: props.item.id
    }
  };
});

const imageUrl = computed(() => {
  if (props.item.photo) return props.item.photo;
  return props.type === 'publishers' 
    ? publicAsset('img/cover.jpg')
    : publicAsset('img/human.jpg');
});
</script>