<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-1/2" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Author name</label>
        <UInput v-model="fullName" placeholder="Author's fullname"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Photo</label>
        <UInput type="file" @change="handleFileUpload"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Birth year</label>
        <UInput v-model="birthYear" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Death year</label>
        <UInput v-model="deathYear" />
      </div>
      <div class="flex justify-between gap-4">
        <button type="submit" 
          class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {{ useRoute().query?.id ? 'Update' : 'Add new' }}
        </button>
      </div>
      <h3 v-if="errorMessage" class="text-red-500">{{ errorMessage }}</h3>
      <h3 v-if="successMessage" class="text-green-600">{{ successMessage }}</h3>
    </form>

    <!-- Photo Preview -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <div id="photo-frame" 
        class="w-60 h-80 bg-gray-100 border-2 border-solid border-gray-400 rounded-lg shadow flex items-center justify-center overflow-hidden">
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Photo Preview" 
          class="max-w-full h-auto rounded-lg shadow"
        />
        <span v-else id="placeholder-text" class="text-gray-500 text-sm">No Photo Selected</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { processAuthor, searchAuthors, author } = useAuthors();
const fullName = ref(null);
const birthYear = ref(null);
const deathYear = ref(null);
const selectedPhoto = ref(null);
const imagePreview = ref(null);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async() => {
  const authorId = useRoute().query?.id;
  if (authorId) {
    const response = await searchAuthors([authorId]);
    fullName.value = response[0].fullname;
    birthYear.value = response[0].birthYear;
    deathYear.value = response[0].deathYear;
    selectedPhoto.value = null;
    imagePreview.value = response[0].photo;
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  author.value = {
    id: useRoute().query?.id,
    fullName: fullName.value,
    birthYear: birthYear.value || null,
    deathYear: deathYear.value || null,
  };

  if (selectedPhoto.value) {
    author.value = {
      ...author.value,
      photo: selectedPhoto.value
    }
  }

  const response = await processAuthor(author.value);
  if (response && response[0]?.id) {
    successMessage.value = 'New author was created succesfully!'
  } else {
    errorMessage.value = 'Creating new author was failed!'
  }
}
</script>