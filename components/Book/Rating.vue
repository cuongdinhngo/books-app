<template>
  <div class="p-3">
    <div class="mb-4" v-if="status === 'success'">
      <div class="flex items-center">
        <label class="block text-gray-600 font-medium mr-3">Average Rating: </label>
        <BookStarRating :rating="data?.rating.data?.average_rating" :is-show-value="true"/>
        <span class="ml-2 text-gray-800">({{ data?.rating.data?.review_count }} reviews)</span>
      </div>
    </div>
    <LoadingProcess v-if="status === 'pending'" />
    <div class="space-y-4">
      <BookReview
        v-if="status === 'success'"
        v-for="review in data?.reviews.data"
        :key="review.id"
        :review="review"
      />
      <LoadingCard
        v-if="status === 'pending'"
        :quantity="4"
        :class-value="`w-full h-30 my-3`"
      />
    </div>

    <Pagination
      v-model="page"
      v-if="data?.reviews.count > 0"
      :totalCounts="data?.reviews.count"
      :items-per-page="pageSize"
      @changePage="handlePageChange"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';

const { index:getBookReviews } = useBooksReviews();
const supabase = useSupabaseClient();

const page = ref(useRouteQuery('page', 1, { transform: Number }));
const pageSize = 10;
const bookId = useRouteParams('id', null, { transform: Number });
const searchParams = ref({
  bookId: bookId.value,
  page: page.value,
  size: pageSize
});

const { data, error, status } = useAsyncData(
  `book/${bookId.value}/reviews`,
  async() => {
    const [rating, reviews] = await Promise.all([
      supabase.rpc('get_average_rating_by_book', { p_book_id: bookId.value }).single(),
      getBookReviews({ columns: 'id,rating,content,created_at,users(id,name)', ...searchParams.value })
    ]);

    return { rating, reviews };
  },
  {
    watch: [searchParams.value]
  }
);

function handlePageChange(newPage: number) {
  page.value = newPage;
  searchParams.value.page = newPage;
}
</script>