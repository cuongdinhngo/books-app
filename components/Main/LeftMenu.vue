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
const { getCategories } = useCategories();
const { getPublishersFilter } = usePublishers();
const items = ref([]);

let categories = await getCategories({search: 'id, label:name'});
let categoryChildren = computed(() => {
  return categories.map(item => ({...item, to: `/?category=${item.id}`}));
});
const categoriesMenu = {
  label: 'Categories',
  icon: 'i-lucide-book-open',
  children: categoryChildren
};
items.value.push(categoriesMenu);

let publishers = await getPublishersFilter();
let publisherChildren = computed(() => {
  return publishers.map(item => ({...item, to: `/?publisher=${item.id}`}));
});
const publishesrMenu = {
  label: 'Publishers',
  icon: 'lucide:building-2',
  children: publisherChildren
};

items.value.push(publishesrMenu);
</script>