<template>
  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-1/3 flex justify-center">
      <img 
        :src="book?.data.coverImage" 
        alt="Book Cover" 
        class="w-80 h-100 object-cover rounded-lg shadow"
      />
    </div>

    <div class="w-full md:w-2/3 space-y-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">{{ book?.data.title }}</p>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Authors</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="author in book?.data.authors" :key="author.id">
            {{ author.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Categories</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="category in book?.data.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div>
        <div class="flex items-center space-x-1">
          <label class="block text-sm font-medium text-gray-400">Quantity: </label>
          <span class="text-gray-900">{{ book?.data?.book_items.filter(item => item.status === 'opening').length }}</span>
        </div>
        <button
          v-if="book?.data?.book_items.filter(item => item.status === 'opening').length > 0" 
          class="bg-primary-500 py-1.5 px-2.5 rounded-md"
          @click="handleBorrow"
        >
          Borrow
        </button>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Description</label>
        <p class=" text-gray-900">{{ book?.data.description }}</p>
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