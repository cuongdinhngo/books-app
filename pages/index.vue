<template>
  <h3 class="text-stone-800 font-bold mb-1">Top Ratings</h3>
  <UCarousel
    v-slot="{ item }"
    loop
    arrows
    :items="data.data"
    :ui="{
      item: 'basis-1/4',
      next: 'end-0',
      prev: 'start-0'
    }"
    class="p-5 bg-primary-50"
  >
    <BookRatingItem
      :book="item"
    />
  </UCarousel>

  <h3 class="text-stone-800 font-bold my-1">New Books</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
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
import { useRouteQuery } from '@vueuse/router';
definePageMeta({
  layout: 'main'
})

const { index, getTopRatings } = useBooks();
const page = ref<number>(useRouteQuery('page', '1', { transform: Number }));
const category = ref<number|null>(useRouteQuery('category'));
const publisher = ref<number|null>(useRouteQuery('publisher'));
const pageSize = 5;
const searchParams = ref({
  page: page.value,
  size: pageSize,
  title: null,
  categoryIds: category.value ? [category.value] : [],
  publisherIds: publisher.value ? [publisher.value] : [],
});

const items = [
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  },
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  },
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  },
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  },
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  },
  {
    "book_id": 33,
    "book_title": "The Godfather",
    "book_image": "https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/cd6d319e-6a6f-441c-94b4-bcdabcedf07f.png",
    "average_rating": 4,
    "rating_count": 2
  }
];

const { data:book, error, refresh, clear } = await useAsyncData(
  `main-book-page:${page.value || 0}-category:${category.value || 'all'}-publisher:${publisher.value || 'all'}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const { data, error:ratingError } = await useAsyncData(
  `top-rating-books`,
  () => getTopRatings()
);

console.log('DATA => ', data);

watch(
  () => useRoute().query,
  async(newQuery) => {
    console.log('NEW QUERIES => ', newQuery);
    if (newQuery.page) {
      page.value = Number(newQuery.page);
      searchParams.value.page = Number(newQuery.page);
    }
    if (newQuery.search) {
      searchParams.value.title = newQuery.search;
    }
    searchParams.value.categoryIds = newQuery.category ? [Number(newQuery.category)] : [];
    searchParams.value.publisherIds = newQuery.publisher ? [Number(newQuery.publisher)] : [];

  }
);
</script>