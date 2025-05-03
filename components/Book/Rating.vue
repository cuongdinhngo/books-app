<template>
  <div class="p-3">
    <div class="mb-4">
      <label class="block text-gray-600 font-medium">Average Rating</label>
      <div class="flex items-center">
          <span class="text-yellow-500">{{ generateRating(data?.rating.data?.average_rating) }}</span>
          <span class="ml-2 text-gray-800"> {{ data?.rating.data?.average_rating }}/ 5 ({{ data?.rating.data?.review_count }} reviews)</span>
      </div>
    </div>
    <div class="space-y-4">
      <BookReview
        v-for="review in data?.reviews.data"
        :key="review.id"
        :review="review"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';

const { index:getBookReviews } = useReviews();
const supabase = useSupabaseClient();
const bookId = useRouteParams('id', null, {transform: Number});

const { data, error } = await useAsyncData(
  `book`,
  async() => {
    const [rating, reviews] = await Promise.all([
      supabase.rpc('get_average_rating_by_book', { p_book_id: bookId.value }).single(),
      getBookReviews({ columns: 'id,rating,content,created_at,readers(id,fullName:full_name)', bookId: bookId.value })
    ]);

    return { rating, reviews };
  }
);

console.log('DATA => ', data);
</script>