<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-1/2" @submit.prevent="submitForm">
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

      <FormInputNumberDiv
        v-model="quantity"
        label-name="Quantity"
        placeholder="Enter quantity"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <UTextarea
          v-model="description"
          :rows="5"
          autoresize
          class="w-full"
        />
      </div>

      <FormButtonDiv
        :label="useRoute().query?.id ? 'Update' : 'Add new'"
      />

      <h3 v-if="errorMessage" class="text-red-500">{{ errorMessage }}</h3>
      <h3 v-if="successMessage" class="text-green-600">{{ successMessage }}</h3>
    </form>

    <!-- Photo Preview -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <FormPhotoReview
        :image-preview="imagePreview"
      />
    </div>
  </div>
</template>

<script setup>
const { processBook, getBookById } = useBooks();
const { processBookAuthor } = useBooksAuthors();
const { processBookCategory } = useBooksCategories();
const { processBookPublisher } = useBooksPublishers();

const title = ref(null);
const selectedAuthors = ref(null);
const selectedCategories = ref(null);
const selectedPublishers = ref(null);
const selectedPhoto = ref(null);
const imagePreview = ref(null);
const quantity = ref(null);
const description = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const oldAuthors = ref(null);
const oldCategories = ref(null);
const oldPublishers = ref(null);

onMounted(async() => {
  const bookId = useRoute().query?.id;
  if (bookId) {
    const book = await getBookById(bookId);
    title.value = book.title;
    description.value = book.description;
    quantity.value = book.quantity;
    selectedPhoto.value = null;
    imagePreview.value = book.coverImage;
    selectedPublishers.value = book.publishers.map(publisher => publisher.id);;
    selectedCategories.value = book.categories.map(category => category.id);
    selectedAuthors.value = book.authors.map(author => author.id);
    oldCategories.value = book.categories.map(category => category.id);
    oldAuthors.value = book.authors.map(author => author.id);
    oldPublishers.value = book.publishers.map(publisher => publisher.id);;
  }
});

const handleFileUpload = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  let data = {
    id: useRoute().query?.id,
    title: title.value,
    quantity: quantity.value || null,
    description: description.value || null
  };

  if (selectedPhoto.value) {
    data = {
      ...data,
      cover_image: selectedPhoto.value
    }
  }

  const response = await processBook(data);
  if (response && response?.id) {
    const bookId = response?.id;

    if (oldAuthors.value !== selectedAuthors.value) {
      await processBookAuthor(
        bookId,
        selectedAuthors.value.map(author => ({
          book_id: bookId,
          author_id: author,
        })),
        oldAuthors.value
      );
    }

    if (oldCategories.value !== selectedCategories.value) {
      await processBookCategory(
        bookId,
        selectedCategories.value.map(category => ({
          category_id: category,
          book_id: bookId
        })),
        oldCategories.value
      );
    }

    if (oldPublishers.value !== selectedPublishers.value) {
      await processBookPublisher(
        bookId,
        selectedPublishers.value.map(publisher => ({
          publisher_id: publisher,
          book_id: bookId
        })),
        oldCategories.value
      );
    }

    successMessage.value = 'New book was created succesfully!'
  } else {
    errorMessage.value = 'Creating new book was failed!'
  }
}
</script>