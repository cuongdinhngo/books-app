<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <BookItem
      v-for="item in book.data"
      :key="item.id"
      :book="item"
    />
  </div>
  <Pagination
    v-model="page"
    v-if="book?.count > 0"
    :totalCounts="book.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
  <h3 v-else class="flex justify-center">No data</h3>
</template>

<script setup>
definePageMeta({
  layout: 'main'
})

const searchTerm = useSearchTerm();
const { query } = useRoute();
const { index} = useBooks();
const page = ref(Number(query.page) || 1);
const pageSize = 5;
const searchParams = ref({
  page: page.value,
  size: pageSize,
  title: searchTerm.value
});

const { data: book, error, refresh, clear } = await useAsyncData(
  `main-book-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const debouncedFn = useDebounceFn(async(newSearchTerm) => {
  page.value = 1;
  searchParams.value.page = page.value;
  searchParams.value.title = newSearchTerm;
}, 500, { maxWait: 5000 })

watch(
  () => searchTerm.value,
  (newSearchTerm) => {
    debouncedFn(newSearchTerm);
  }
);
</script>