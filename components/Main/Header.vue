<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white"><NuxtLink to="/">Look Book</NuxtLink></div>
    <div class="w-1/2">

      <UModal>
        <UButton
          label="Search"
          color="neutral"
          variant="subtle"
          icon="lucide-search"
          class="w-100"
        />

        <template #content>
          <UCommandPalette
            v-model:search-term="searchTerm"
            :loading="status === 'pending'"
            :groups="resultGroups"
            placeholder="Search users..."
            class="h-80"
            @keyup.enter="handleSearch"
          />
        </template>
      </UModal>
    </div>
    <div class="flex items-center space-x-4">
      <MainRightHeader />
    </div>

  </header>
</template>

<script setup lang="ts">
const { index:getBooks } = useBooks();
const { index:getAuthors } = useAuthors();
const { index:getCategories } = useCategories();
const { index:getPublishers } = usePublishers();

const searchTerm = ref<string>('');
const resultGroups = ref<Array<any>>([]);

function handleSearch() {
  Promise.all([
    getBooks({ title: searchTerm.value }),
    getCategories({ name: searchTerm.value }),
    getPublishers({ name: searchTerm.value })
  ])
  .then(([books, categories, publishers]) => {
    if (books.error || categories.error || publishers.error) throw new Error("Search function is failed");

    if (null === books.error && books?.count > 0) {
      resultGroups.value.push({
        id: 'books',
        label: 'Books',
        items: books.data.map(item => ({
          id: item.id,
          label: item.title,
          to: `book/${item.id}`,
          target: '_blank',
          avatar: {
            src: item.coverImage
          }
        }))
      });
    }

    if (null === categories.error && categories?.count > 0) {
      resultGroups.value.push({
        id: 'categories',
        label: 'Categories',
        items: categories.data.map(item => ({
          id: item.id,
          label: item.name,
          to: `/?categories=${item.id}`,
          target: '_blank'
        }))
      });
    }

    if (null === publishers.error && publishers?.count > 0) {
      resultGroups.value.push({
        id: 'publishers',
        label: 'Publishers',
        items: publishers.data.map(item => ({
          id: item.id,
          label: item.name,
          to: `/?publishers=${item.id}`,
          target: '_blank'
        }))
      });
    }
  })
  .catch((error) => useToastError(error));
}
</script>