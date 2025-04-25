<template>
  <div class="bg-white p-6 w-full">
    <form @submit.prevent="submitForm">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left Side -->
        <div class="w-full md:w-1/2 space-y-4">
          <FormInputDiv
            v-model="title"
            label-name="Title"
            placeholder="Enter book's titlte"
          />
          <div>
            <label class="block text-sm font-medium text-gray-700">Publisher</label>
            <FilterPublisher
              v-model="selectedPublishers"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <FilterCategory
              v-model="selectedCategories"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Author</label>
            <FilterAuthor
              v-model="selectedAuthors"
            />
          </div>

          <FormInputDiv
            label-name="Book cover photo"
            placeholder="Cover photo"
            type="file"
            @change="handleFileUpload"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <UInputNumber
              v-model="quantity"
              orientation="vertical"
              placeholder="Enter quantity"
              :min="0"
              @change="updateItemStatus"
            />
          </div>
        </div>
        <!-- Photo Preview -->
        <div class="w-full md:w-1/2">
          <div class="flex w-75 h-90 bg-gray-100 rounded-md">
            <img id="photoPreview" v-if="imagePreview" :src="imagePreview" alt="Photo Preview" class="rounded-md">
          </div>
        </div>
      </div>
      <div class="mt-6">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <UTextarea
          v-model="description"
          :rows="5"
          autoresize
          class="w-full"
        />
      </div>
      <div class="mt-6">
        <button
          type="submit"
          class="w-full md:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add new
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';

const { index, insert } = useBooks();
const { insert:insertBookAuthors } = useBooksAuthors();
const { insert:insertBookCategories } = useBooksCategories();
const { insert:insertBookPublishers } = useBooksPublishers();
const { insert:insertBookItems } = useBookItems();

const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const selectedPhoto = ref(null);
const imagePreview = ref('');
const quantity = ref(0);
const description = ref(null);

const handleFileUpload = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  let book = {
    title: title.value,
    quantity: quantity.value,
    description: description.value
  } as Tables<'books'>;

  if (selectedPhoto.value) {
    book = {
      ...book,
      cover_image: selectedPhoto.value
    }
  }

  await insert(book)
    .then(async({ error }) => {
      if (error) throw error;

      const { data:book, error:getError } = await index({ title: title.value }).limit(1).single();
      if (getError) throw getError;

      //insert books_authors
      const bookAuthors = selectedAuthors.value.map(author => ({
        author_id: author,
        book_id: book.id
      }));
      const { error:bookAuthorsError } = await insertBookAuthors(bookAuthors);
      if (bookAuthorsError) throw bookAuthorsError;

      //insert books_categories
      const bookCategories = selectedCategories.value.map(category => ({
        book_id: book.id,
        category_id: category
      }));
      const { error: bookCategoriesError } = await insertBookCategories(bookCategories);
      if (bookCategoriesError) throw bookCategoriesError;

      //insert books_publishers
      const bookPublishers = selectedPublishers.value.map(publisher => ({
        book_id: book.id,
        publisher_id: publisher
      }));
      const { error: bookPublishersError } = await insertBookPublishers(bookPublishers);
      if (bookPublishersError) throw bookPublishersError;

      const booksItemsData = Array.from({ length: quantity.value }, () => ({ book_id: book.id, status: 'pending' }));
      const { error: bookItemsError } = await insertBookItems(booksItemsData);
      if (bookItemsError) throw bookItemsError;

      useToastSuccess();
      title.value = '';
      quantity.value = 0;
      selectedAuthors.value = [];
      selectedCategories.value = [];
      selectedPublishers.value = [];
      description.value = '';
    })
    .catch((error) => useToastError(error));
}
</script>