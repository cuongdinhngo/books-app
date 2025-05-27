<template>
  <h3 class="text-stone-800 font-bold mb-1">
    You might like these
  </h3>
  <UCarousel
    v-if="status === 'success'"
    v-slot="{ item }"
    loop
    arrows
    dots
    :items="data?.data"
    :ui="{ item: 'basis-1/7', next: 'end-0', prev: 'start-0' }"
    class="p-5 bg-primary-50"
  >
  <NuxtLink :to="{ name: 'book-id', params: { id: item?.book_id } }">
    <div class="bg-white pt-3 text-stone-600 h-[260px] rounded-lg hover:shadow-lg">
      <img :src="item.cover_image || getDefaultBookCover()" class="w-full h-48 object-scale-down">
      <p class="font-bold line-clamp-1 text-sm text-center">{{ item?.title }}</p>
      <p class="text-center text-sm">Borrowed counts: {{ item.borrow_count }}</p>
    </div>
  </NuxtLink>
  </UCarousel>
  <LoadingCard
    v-if="status === 'pending'"
    :quantity="6"
    :class-value="`w-full h-[340px]`"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  historyKey: {
    type: String,
    default: 'categories'
  },
  limit: {
    type: Number,
    default: 10
  } 
});

const route = useRoute();
const { getTopBorrowedBooksByHistoricalVisits } = useBooks();

const { data, error, status } = useAsyncData(
  `top-books-by-historical-visits?route=${route.name}`,
  () => getTopBorrowedBooksByHistoricalVisits(props.historyKey, props.limit)
);
</script>