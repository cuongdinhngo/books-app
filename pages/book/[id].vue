<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Book Cover -->
    <div class="w-full md:w-1/3 flex justify-center">
      <img 
        :src="data?.book.data.coverImage"
        alt="Book Cover" 
        class="w-80 h-100 object-cover rounded-lg shadow"
      />
    </div>

    <!-- Book Info -->
    <div class="w-full md:w-2/3 space-y-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">{{ data?.book.data.title }}</p>
        <div class="flex items-center text-sm text-gray-900 mt-1">
          <span class="text-yellow-500">{{  }}</span>
          <span class="ml-2 text-yellow-500">{{ generateRating(data?.rating.data.average_rating ?? 0) }}</span> <span class="ml-2"> {{ data?.rating.data.average_rating ?? 0 }} / 5 ({{ data?.rating.data.review_count }} reviews)</span>
        </div>
        <div class="text-sm font-medium mt-1">
          <label class="inline text-gray-600">Borrowed Counts:</label>
          <span class="text-gray-900 ml-2">{{ data?.borrowedCounts.count }}</span>
        </div>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-600">Authors</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="author in data?.book.data.authors" :key="author.id">
            {{ author.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-600">Categories</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="category in data?.book.data.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="inline text-gray-600">Quantity: </label>
        <span class="text-gray-900"> {{ data?.book.data?.book_copies.filter(item => item.status === 'opening').length }} </span>
      </div>
      <div class="flex space-x-4">
        <UButton
          v-if="data?.book.data?.book_copies.filter(item => item.status === 'opening').length > 0"
          icon="lucide:shopping-cart"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleBorrow"
        >
            Borrow
        </UButton>
        <UButton
          icon="lucide:book-heart"
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleWishlist"
        >
            Wishlist
        </UButton>
      </div>
    </div>
  </div>

  <!-- Description -->
  <div class="mt-6 text-sm font-medium">
    <label class="block text-gray-600">Description</label>
    <p class=" text-gray-900">{{ data?.book.data.description }}</p>
  </div>

  <!-- Review Form -->
  <div
    class="mt-6"
    v-if="isSubmittedReview === false"
  >
    <h3 class="font-medium text-gray-800 mb-4">Submit a Review</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
            <label class="block text-gray-600 font-medium mb-1 text-sm">Rating</label>
            <select
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-800"
              v-model="rating"
            >
              <option value="" selected>Select rating</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★☆</option>
              <option value="3">★★★☆☆</option>
              <option value="2">★★☆☆☆</option>
              <option value="1">★☆☆☆☆</option>
            </select>
            <button
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              @click="submitReview"
            >
              Submit Review
            </button>
        </div>
        <div class="md:col-span-2">
            <label class="block text-gray-600 font-medium mb-1 text-sm">Review</label>
            <textarea
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-800"
              rows="4"
              placeholder="Write your review here"
              v-model="content"
            ></textarea>
        </div>
    </div>
  </div>

  <!-- Reader Reviews -->
  <div class="mt-6">
    <h3
      v-if="data?.rating.data.review_count"
      class="font-medium text-gray-800 mb-4"
    >
      Reader Reviews
    </h3>
    <h3
      v-else
      class="font-medium text-gray-800 mb-4"
    >
      No Reader Reviews
    </h3>

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
definePageMeta({
  layout: 'main'
})

import { useRouteParams } from '@vueuse/router';

const { userId } = useAuth();
const { addToCart } = useBookCarts();
const { insert, index:getBookReviews } = useBooksReviews();
const { get:getBookDetails } = useBooks();
const { insert:addToWishlist } = useWishlists();
const { index:getBorrowedBookCounts } = useOrders();

const supabase = useSupabaseClient();
const bookId = useRouteParams('id', null, { transform: Number });
const rating = ref('');
const content = ref('');
const wishlists = ref([]);

const { data, error, refresh } = await useAsyncData(
  `book-${bookId.value}`,
  async () => {
    const [book, reviews, rating, borrowedCounts] = await Promise.all([
      getBookDetails(bookId.value, 'wishlists(id, book_id)'),
      getBookReviews({ columns: 'id,rating,content,created_at,users(id,name)', bookId: bookId.value }),
      supabase.rpc('get_average_rating_by_book', { p_book_id: bookId.value }).single(),
      getBorrowedBookCounts({ bookId: bookId.value, isHead: true })
    ])

    return { book, reviews, rating, borrowedCounts}
  }
);

console.log('BOOK => ', data.value);

const isSubmittedReview = computed(() => {
  console.log('COMPUTED => ', data.value?.reviews);
  if (!userId.value) {
    return true;
  }
  const reviews = data.value?.reviews.data?.find(item => (item.readers.id === userId.value));
  return reviews ? Object.keys(reviews).length > 0 : false;
});

wishlists.value = data.value?.book.data.wishlists;

async function handleWishlist() {
  if (!userId.value) {
    useToastError('Unauthenticated User','Please login to add to wishlist');
    return;
  }

  const current = wishlists.value.filter(item => (item.book_id === bookId.value));
  if (current.length > 0) {
    return;
  }

  await addToWishlist({ reader_id: userId.value, book_id: bookId.value })
    .then(({ error }) => {
      if (error) throw error;

      wishlists.value.push({ reader_id: userId.value, book_id: bookId.value });
      refresh();
      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}

async function submitReview() {
  await insert({ rating: rating.value, content: content.value, book_id: bookId.value, reader_id: userId.value })
    .then(({ error }) => {
      if (error) throw error;

      rating.value = '';
      content.value = '';
      refresh();
      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}

function handleBorrow() {
  addToCart(bookId.value);
  useToastSuccess();
}
</script>