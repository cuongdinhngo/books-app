<template>
  <aside class="bg-gray-800 text-white w-full md:w-64 p-4 h-auto md:h-screen">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      variant="pill"
      highlight
      highlight-color="red"
      class="data-[orientation=vertical]:w-48"
    />
  </aside>
</template>

<script setup>
const { getCategoriesFilter } = useCategories();
const { getPublishersFilter } = usePublishers();
const items = ref([
  {
    label: 'Categories',
    icon: 'i-lucide-book-open',
    children: [
    ]
  },
  {
    label: 'Publishers',
    icon: 'lucide:building-2',
    children: [
    ]
  },
]);

let categories = await getCategoriesFilter();
let categoryChildren = categories.map(item => ({
  ...item,
  to: `/?category=${item.id}`
}));
items.value[0].children = items.value[0].children.concat(categoryChildren);

let publishers = await getPublishersFilter();
let publisherChildren = publishers.map(item => ({
  ...item,
  to: `/?publisher=${item.id}`
}));
items.value[1].children = items.value[1].children.concat(publisherChildren);
</script>