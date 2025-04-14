<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <BookItem
      v-for="book in books"
      :key="book.bookId"
      :book="book"
    />
  </div>
  <Pagination
    v-model="page"
    v-if="totalBooks > 0"
    :totalCounts="totalBooks"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
  <h3 v-else class="flex justify-center">No data</h3>
</template>

<script setup>
definePageMeta({
  layout: 'main'
})

const {books, totalBooks, searchBook, perPage, searchTerm} = useBooks();
const page = ref(1);
const route = useRoute();

const handlePageChange = async(newPage) => {
  await searchBook(null, Number(newPage));
}

function parseRoute(query) {
  let searchQuery = {};
  if (query.category) {
    searchQuery = {categoryIds: [query.category]};
  }
  if (query.publisher) {
    searchQuery = {publisherIds: [query.publisher]};
  }

  return searchQuery;
}

onMounted(async() => {
  let searchQuery = parseRoute(route.query);
  await searchBook(searchQuery);
});

const debouncedFn = useDebounceFn(async(newSearchTerm) => {
  console.log('watching .. ', searchTerm.value);
  await searchBook({title: newSearchTerm});
}, 500, { maxWait: 5000 })

watch(
  () => searchTerm.value,
  (newSearchTerm) => {
    debouncedFn(newSearchTerm);
  }
);

watch(
  () => route.query,
  async(newRoute) => {
    let searchQuery = parseRoute(newRoute);
    console.log('watching ...', searchQuery);
    await searchBook(searchQuery);
  }
);

</script>