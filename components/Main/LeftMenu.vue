<template>
  <aside class="bg-gray-800 text-white w-full md:w-64 p-4 md:h-screen">
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

const { data } = await useAsyncData(
  `lef-menu`,
  async () => {
    const [categories, publishers] = await Promise.all([
      getCategories({ columns: 'id, label:name' }),
      getPublishers({ columns: 'id, label:name' })
    ]);

    const categoriesMenu = {
      label: 'Categories',
      icon: 'lucide:book-open',
      children: categories.data.map(item => ({...item, to: `/?category=${item.id}`}))
    };

    const publishersMenu = {
      label: 'Publishers',
      icon: 'lucide:building-2',
      children: publishers.data.map(item => ({...item, to: `/?publisher=${item.id}`}))
    };

    return {categoriesMenu, publishersMenu};
  }
);

items.value.push(data.value.categoriesMenu);
items.value.push(data.value.publishersMenu);
</script>