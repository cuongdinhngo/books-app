<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleFilters">
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
      <input type="text" id="search" name="search" 
        class="w-full text-stone-900 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Search by title or author..."
      />
    </div>
    <!-- <div>
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <FilterCategory
          v-model="selectedCatogories"
        />
    </div> -->
    <!-- <div>
        <label class="block text-sm font-medium text-gray-700">Author</label>
        <FilterAuthor />
    </div> -->
    <!-- <div>
        <label class="block text-sm font-medium text-gray-700">Publisher</label>
        <FilterPublisher />
    </div> -->
    <div class="flex justify-between gap-4">
      <button type="submit" 
        class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Filter
      </button>
      <a href="/create-book" 
        class="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 text-center"
      >
        Create New Book
      </a>
    </div>
  </form>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- <BookItem
      v-if="books && books.length > 0"
      v-for="book in books"
      :key="book.id"
      :book="book"
    />
    <UProgress v-else animation="swing" size="lg"/> -->
  </div>

  <!-- Pagination -->
  <div class="mt-6 flex justify-center space-x-2 text-stone-950" id="with-links">
    <!-- <UPagination
      v-model="page"
      show-edges
      :sibling-count="2"
      :items-per-page="perPage || 20"
      :total="totalBooks"
      :to="to"
    /> -->
  </div>
</template>

<script setup>
const { getAllBooks, books, perPage, totalBooks } = useBooks();
const route = useRoute();
const page = ref(1);
function to(page) {
  return {
    query: {
      page
    },
    hash: '#with-links'
  }
}

const selectedCatogories = ref([]);
const authors = ref([]);
const publishers = ref([]);

const handleFilters = async() => {
  console.log('selected categories: => ', selectedCatogories.value);
  let formData = new FormData();
  formData.append('categories', selectedCatogories.value);
}

// onMounted(async() => {
//   await getAllBooks(page.value);
// });

// watch(
//   route,
//   async(newRoute) => {
//     await getAllBooks(newRoute.query.page)
//   },
//   { immediate: true }
// );
</script>