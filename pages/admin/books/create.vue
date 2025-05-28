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

          <!-- Book Cover upload-->
          <FormInputDiv
            label-name="Book cover photo"
            placeholder="Cover photo"
            type="file"
            :multiple="true"
            @change="handleFileUpload"
          />

          <!-- Book Preview upload-->
          <div>
            <label class="block text-sm font-medium text-gray-700">Book preview</label>
            <div class="flex w-full justify-between items-center">
              <input
                class="text-sm w-2/3 border p-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-stone-900 mr-2"
                placeholder="Book preview pdf"
                type="file"
                @change="handlePreviewUpload"
              />
              <UButton
                v-if="bookPreview"
                label="Preview"
                icon="lucide:book-open"
                color="primary"
                variant="subtle"
                @click="previewModal = !previewModal"
              />
              <UModal
                v-if="bookPreview"
                v-model:open="previewModal"
                title="Modal fullscreen"
              >
                <template #content>
                  <iframe
                    :src="bookPreview"
                    class="w-[900px] h-[800px] border-none"
                  ></iframe>
                </template>
              </UModal>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <UInputNumber
              v-model="quantity"
              orientation="vertical"
              placeholder="Enter quantity"
              variant="subtle"
              :min="0"
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

      <!-- Description -->
      <div class="mt-6">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <UTextarea
          v-model="description"
          :rows="5"
          autoresize
          class="w-full"
          variant="subtle"
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
const { insert:insertBookItems } = useBookCopies();
const { insert:insertBookPhotos } = useBookPhotos();

const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const selectedPhotos = ref([]);
const imagePreview = ref('');
const quantity = ref(0);
const description = ref(null);
const selectedPreview = ref(null);
const bookPreview = ref('');
const previewModal = ref(false);
const previewPhotos = ref([]);

const handleFileUpload = (files: Array<File>) => {
  console.log('multiple files => ', files);
  const photos = files.filter((photo) => photo.type.startsWith("image/"));
  if (photos.length > 0) {
    selectedPhotos.value = photos;
    previewPhotos.value = photos.map((photo) => URL.createObjectURL(photo));
    console.log('previewPhotos => ', previewPhotos.value);
    imagePreview.value = previewPhotos.value[0]; // Show the first photo as preview
  } else {
    useToastError('Please upload a valid image file.');
  }
};

const handlePreviewUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    selectedPreview.value = file;
    bookPreview.value = URL.createObjectURL(file);
  } else {
    useToastError('Please upload a valid PDF file.');
  }
};

const submitForm = async() => {
  let book: Tables<'books'> = {
    title: title.value,
    description: description.value
  };

  if (selectedPreview.value) {
    book = {
      ...book,
      preview_file: selectedPreview.value
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

      //insert book_copies
      const booksItemsData = Array.from({ length: quantity.value }, () => ({ book_id: book.id, status: 'pending' }));
      const { error: bookItemsError } = await insertBookItems(booksItemsData);
      if (bookItemsError) throw bookItemsError;

      //insert book_photos
      const { error: bookPhotosError } = await insertBookPhotos(selectedPhotos.value, book.id);

      useToastSuccess();
      title.value = '';
      quantity.value = 0;
      selectedAuthors.value = [];
      selectedCategories.value = [];
      selectedPublishers.value = [];
      description.value = null;
      selectedPreview.value = null;
      selectedPhotos.value = [];
      imagePreview.value = '';
      bookPreview.value = '';
      
      // Add timeout and navigation
      setTimeout(() => {
        navigateTo({name: 'admin-books-id', params: { id: book.id } });
      }, 1000);
    })
    .catch((error) => useToastError(error));
}
</script>