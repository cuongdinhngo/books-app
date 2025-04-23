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
const { index: getCategories } = useCategories();
const { index: getPublishers } = usePublishers();
const items = ref([]);

const { data: categories } = await getCategories({ columns: 'id, label:name' });
const categoryChildren = computed(() => {
  return categories.map(item => ({...item, to: `/?category=${item.id}`}));
});
const categoriesMenu = {
  label: 'Categories',
  icon: 'lucide:book-open',
  children: categoryChildren.value
};
items.value.push(categoriesMenu);

const { data: publishers } = await getPublishers({ columns: 'id, label:name' });
const publisherChildren = computed(() => {
  return publishers.map(item => ({...item, to: `/?publisher=${item.id}`}));
});
const publisherMenu = {
  label: 'Publishers',
  icon: 'lucide:building-2',
  children: publisherChildren.value
};
items.value.push(publisherMenu);
</script>