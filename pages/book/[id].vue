<template>
  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-1/3 flex justify-center">
      <img 
        :src="book?.coverImage" 
        alt="Book Cover" 
        class="w-80 h-100 object-cover rounded-lg shadow"
      />
    </div>

    <div class="w-full md:w-2/3 space-y-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">{{ book?.title }}</p>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Authors</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="author in book?.authors" :key="author.id">
            {{ author.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Categories</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="category in book?.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div>
        <div class="flex items-center space-x-1">
          <label class="block text-sm font-medium text-gray-400">Quantity: </label>
          <span class="text-gray-900">{{ availableBookCounts }}</span>
        </div>
        <button
          v-if="availableBookCounts > 0" 
          class="bg-primary-500 py-1.5 px-2.5 rounded-md"
          @click="handleBorrow"
        >
          Borrow
        </button>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Description</label>
        <p class=" text-gray-900">{{ book?.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main'
})
const { getBookById, book } = useBooks();
const { bookCart, addToCart } = useBookCarts();

const availableBookCounts = ref(0);
const bookId = ref(null);

const handleBorrow = () => {
  addToCart(Number(bookId.value));
  console.log('book cart -> ', bookCart.value);
}

onMounted(async() => {
  bookId.value = useRoute().params.id;
  await getBookById(useRoute().params.id, 'open');
  availableBookCounts.value = book?.value.bookItemCounts;
});
</script>