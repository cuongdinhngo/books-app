<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Book Cover -->
    <div class="w-full md:w-1/3 flex justify-center">
      <img 
        :src="book?.data.coverImage" 
        alt="Book Cover" 
        class="w-80 h-100 object-cover rounded-lg shadow"
      />
    </div>

    <!-- Book Info -->
    <div class="w-full md:w-2/3 space-y-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">{{ book?.data.title }}</p>
        <div class="flex items-center text-sm text-gray-900 mt-1">
          <span class="text-yellow-500">{{ book?.data.averageRating || '★★★★☆' }}</span>
          <span class="ml-2">4.2 / 5 (120 reviews)</span>
        </div>
        <div class="text-sm font-medium mt-1">
          <label class="inline text-gray-600">Borrowed Counts:</label>
          <span class="text-gray-900 ml-2">25</span>
        </div>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-600">Authors</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="author in book?.data.authors" :key="author.id">
            {{ author.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-600">Categories</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="category in book?.data.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="inline text-gray-600">Quantity: </label>
        <span class="text-gray-900"> {{ book?.data?.book_items.filter(item => item.status === 'opening').length }} </span>
      </div>
      <div class="flex space-x-4">
        <button
          v-if="book?.data?.book_items.filter(item => item.status === 'opening').length > 0" 
          class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleBorrow"
        >
            Borrow
        </button>
        <button
            class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            @click="addToWishlist"
        >
            Wishlist
        </button>
      </div>
    </div>
  </div>

  <!-- Description -->
  <div class="mt-6 text-sm font-medium">
    <label class="block text-gray-600">Description</label>
    <p class=" text-gray-900">{{ book?.data.description }}</p>
  </div>

  <!-- Review Form -->
  <div class="mt-6">
    <h3 class="font-medium text-gray-800 mb-4">Submit a Review</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
            <label class="block text-gray-600 font-medium mb-1 text-sm">Rating</label>
            <select
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" selected>Select rating</option>
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
            <button
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              Submit Review
            </button>
        </div>
        <div class="md:col-span-2">
            <label class="block text-gray-600 font-medium mb-1 text-sm">Review</label>
            <textarea
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Write your review here"
              disabled
            ></textarea>
        </div>
    </div>
  </div>

  <!-- Reader Reviews -->
  <div class="mt-6">
    <h3 class="font-medium text-gray-800 mb-4">Reader Reviews</h3>
    <div class="space-y-4">
      <div class="border-b pb-4">
        <div class="flex items-center">
            <span class="text-gray-800 font-medium">John Doe</span>
            <span class="ml-2 text-yellow-500">★★★★★</span>
        </div>
          <p class="text-gray-700 mt-1 text-sm">A timeless classic! The writing is beautiful and the story is captivating.</p>
          <p class="text-gray-400 text-sm">Posted on 2025-03-15</p>
      </div>
      <div class="border-b pb-4">
        <div class="flex items-center">
            <span class="text-gray-800 font-medium">John Doe</span>
            <span class="ml-2 text-yellow-500">★★★★★</span>
        </div>
          <p class="text-gray-700 mt-1 text-sm">A timeless classic! The writing is beautiful and the story is captivating.</p>
          <p class="text-gray-400 text-sm">Posted on 2025-03-15</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useRouteParams } from '@vueuse/router';

const { bookCart, addToCart } = useBookCarts();
const bookId = useRouteParams('id', null, { transform: Number });

const handleBorrow = () => {
  addToCart(bookId.value);
  useToastSuccess();
}

const {data: book } = useAsyncData(
  `book-${bookId.value}`,
  () => useBooks().get(bookId.value)
);
</script>