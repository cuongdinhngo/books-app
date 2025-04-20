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
  />
  <h3 v-else class="flex justify-center">No data</h3>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const searchTerm = useSearchTerm();
const { query } = useRoute();
const { index } = useBooks();
const page = ref<number>(Number(query.page) || 1);
const category = ref<number|null>(Number(query.category) || null);
const publisher = ref<number|null>(Number(query.publisher) || null);
const pageSize = 5;
const searchParams = ref({
  page: page.value,
  size: pageSize,
  title: searchTerm.value,
  categoryIds: category.value ? [category.value] : [],
  publisherIds: publisher.value ? [publisher.value] : [],
});

const { data:book, error, refresh, clear } = await useAsyncData(
  `main-book-page:${page.value || 0}-category:${category.value || 'all'}-publisher:${publisher.value || 'all'}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const debouncedFn = useDebounceFn(async(newSearchTerm) => {
  page.value = 1;
  useRouter().replace('/');
  searchParams.value.page = page.value;
  searchParams.value.title = newSearchTerm;
  searchParams.value.categoryIds = [];
  searchParams.value.publisherIds = [];
}, 500, { maxWait: 5000 })

watch(
  () => searchTerm.value,
  (newSearchTerm) => {
    debouncedFn(newSearchTerm);
  }
);

watch(
  () => useRoute().query,
  async(newQuery) => {
    console.log('NEW QUERIES => ', newQuery);
    if (newQuery.page) {
      page.value = Number(newQuery.page);
      searchParams.value.page = Number(newQuery.page);
    }
    if (newQuery.category) {
      searchParams.value.categoryIds = [Number(newQuery.category)];
    }
    if (newQuery.publisher) {
      searchParams.value.publisherIds = [Number(newQuery.publisher)];
    }
  }
);
</script>