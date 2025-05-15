<template>
  <div class="flex flex-col min-h-[calc(100vh-120px)]">
    <div v-if="hasQueries === false" class="mb-6">
      <h3 class="text-stone-800 font-bold mb-1">
        Top Ratings
      </h3>
      <UCarousel
        v-slot="{ item }"
        loop
        arrows
        :items="books?.topRatings"
        :ui="{
          item: 'basis-1/6',
          next: 'end-0',
          prev: 'start-0'
        }"
        class="p-5 bg-primary-50"
      >
        <BookRatingItem
          :book="item"
        />
      </UCarousel>
    </div>

    <div class="flex-grow">
      <h3
        v-if="hasQueries === false"
        class="text-stone-800 font-bold my-1"
      >
        New Books
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 my-5">
        <BookItem
          v-for="item in books.all"
          :key="item.id"
          :book="item"
        />
      </div>
      <div class="mt-auto pt-4">
        <Pagination
          v-model="page"
          v-if="books?.allCount > 0"
          :totalCounts="books.allCount"
          :items-per-page="pageSize"
        />
        <h3 v-else class="flex justify-center">No data</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
definePageMeta({
  layout: 'main'
})

const { index:getAllBooks, getTopRatings } = useBooks();
const { resetBreadcrumbs, addBreadcrumb } = useBreadcrumbs();
const { index:getCategories } = useCategories();
const { index:getPublishers } = usePublishers();
const { index:getAuthors } = useAuthors();

const page = useRouteQuery('page', '1', { transform: Number });
const category = useRouteQuery('category', null, { transform: Number });
const publisher = useRouteQuery('publisher', null, { transform: Number });
const author = useRouteQuery('author', null, { transform: Number });
const pageSize = 15;

const hasQueries = computed(() => isExistedQueries(['category', 'publisher', 'author']));

const searchParams = ref({
  page: page.value,
  size: pageSize,
  title: null,
  categoryIds: category.value ? [category.value] : [],
  publisherIds: publisher.value ? [publisher.value] : [],
  authorIds: author.value ? [author.value] : [],
});

const {data:books, error } = await useAsyncData(
  `index:${JSON.stringify(searchParams.value)}`,
  async() => {
    const [all, topRatings, categories, publishers, authors ] = await Promise.all([
      getAllBooks(searchParams.value),
      getTopRatings(),
      getCategories(),
      getPublishers(),
      getAuthors()
    ]);

    return {
      all: all.data,
      allCount: all.count,
      topRatings: topRatings.data,
      categories: categories.data,
      publishers: publishers.data,
      authors: authors.data
    };
  },
  { watch: [searchParams.value] }
);

async function updateBreadCrumbs(query: Object) {
  resetBreadcrumbs();
  if (query.category) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Categories',
      icon: 'lucide:book',
      children: books.value.categories.map((category) => ({
        label: category.name,
        to: { name: 'index', query: { category: category.id } }
      }))
    });
    const category = books.value.categories.filter((category) => category.id === Number(query.category))[0];
    addBreadcrumb({
      label: category.name,
      icon: 'lucide-book',
      to: { name: 'index', query: { category: category.id } }
    });
  }
  if (query.publisher) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Publishers',
      icon: 'lucide:building-2',
      children: books.value.publishers.map((publisher) => ({
        label: publisher.name,
        to: { name: 'index', query: { publisher: publisher.id } }
      }))
    });
    const publisher = books.value.publishers.filter((publisher) => publisher.id === Number(query.publisher))[0];
    addBreadcrumb({
      label: publisher.name,
      icon: 'lucide:building-2',
      to: { name: 'index', query: { publisher: publisher.id } }
    });
  }
  if (query.author) {
    addBreadcrumb({
      slot: 'dropdown' as const,
      label: 'Authors',
      icon: 'lucide:user',
      children: books.value.authors.map((author) => ({
        label: author.full_name,
        to: { name: 'index', query: { author: author.id } }
      }))
    });
    const author = books.value.authors.filter((author) => author.id === Number(query.author))[0];
    addBreadcrumb({
      label: author.full_name,
      icon: 'lucide-user',
      to: { name: 'index', query: { author: author.id } }
    });
  }
}

onMounted(() => {
  if (hasQueries.value) {
    updateBreadCrumbs(useRoute().query);
  }
});

watch(
  () => useRoute().query,
  async(newQuery) => {
    if (isExistedQueries(['category', 'publisher', 'author'])) {
      updateBreadCrumbs(newQuery);
    }

    if (newQuery.page) {
      page.value = Number(newQuery.page);
      searchParams.value.page = Number(newQuery.page);
    }
    if (newQuery.search) {
      searchParams.value.title = newQuery.search;
    }
    searchParams.value.categoryIds = newQuery.category ? [Number(newQuery.category)] : [];
    searchParams.value.publisherIds = newQuery.publisher ? [Number(newQuery.publisher)] : [];
    searchParams.value.authorIds = newQuery.author ? [Number(newQuery.author)] : [];
  }
);
</script>
