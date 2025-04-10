<template>
  <div class="flex flex-col md:flex-row gap-6">
    <div class="w-full md:w-1/3 flex justify-center">
      <img 
        :src="book.coverImage" 
        alt="Book Cover" 
        class="w-80 h-100 object-cover rounded-lg shadow"
      />
    </div>

    <div class="w-full md:w-2/3 space-y-4">
      <div>
        <p class="text-lg font-semibold text-gray-900">{{ book.title }}</p>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Authors</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="author in book.authors" :key="author.id">
            {{ author.name }}
          </li>
        </ul>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Categories</label>
        <ul class="text-gray-900 list-disc list-inside">
          <li v-for="category in book.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Quantity: 5</label>
      </div>
      <div class="text-sm font-medium">
        <label class="block text-gray-400">Description</label>
        <p class=" text-gray-900">{{ book.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main'
})

const { getBookById } = useBooks();
const book = await getBookById(useRoute().params.id);
</script>