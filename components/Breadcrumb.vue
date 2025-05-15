<template>
  <UBreadcrumb :items="breadcrumbItems">
    <template #dropdown="{ item }">
      <UDropdownMenu :items="item.children">
        <UButton :label="item.label" :icon="item.icon" color="neutral" variant="link" class="p-0.5" />
      </UDropdownMenu>
    </template>
  </UBreadcrumb>
</template>
<script setup lang="ts">
const { addBreadcrumb, breadcrumbItems } = useBreadcrumbs();
const { index:getCategories } = useCategories();
const { index:getPublishers } = usePublishers();
const { index:getAuthors } = useAuthors();

const {data:books, error } = await useAsyncData(
  `default-breadcrumb`,
  async() => {
    const [categories, publishers, authors ] = await Promise.all([
      getCategories(),
      getPublishers(),
      getAuthors()
    ]);

    console.log('CATEGORIES => ', categories.data);

    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Categories',
      icon: 'lucide:book',
      children: categories.data.map((category) => ({
        label: category.name,
        to: { name: 'index', query: { category: category.id } }
      }))
    });

    console.log('BREADCRUMBS => ', breadcrumbItems.value);

    return {
      categories: categories.data,
      publishers: publishers.data,
      authors: authors.data
    };
  }
);

onMounted(() => {
  // console.log('Breadcrumb  => generating ...', books.value);
  // generateBreadcrumbs();
  // console.log('BREADCRUMBS => ', breadcrumbItems.value);
});

function generateBreadcrumbs() {
  if (books.value && books.value.categories && books.value.categories.length > 0) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Categories',
      icon: 'lucide:book',
      children: books.value.categories.map((category) => ({
        label: category.name,
        to: { name: 'index', query: { category: category.id } }
      }))
    });
  }
  if (books.value && books.value.publishers && books.value.publishers.length > 0) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Publishers',
      icon: 'lucide:building-2',
      children: books.value.publishers.map((publisher) => ({
        label: publisher.name,
        to: { name: 'index', query: { publisher: publisher.id } }
      }))
    });
  }
  if (books.value && books.value.authors && books.value.authors.length > 0) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Authors',
      icon: 'lucide:user',
      children: books.value.authors.map((author) => ({
        label: author.full_name,
        to: { name: 'index', query: { author: author.id } }
      }))
    });
  } 
}
</script>