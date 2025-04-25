<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-2/3" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Author name</label>
        <UInput v-model="fullName" placeholder="Author's fullname"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Photo</label>
        <UInput type="file" @change="handleFileUpload" v-model="photoInput"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Birth year</label>
        <UInput v-model="birthYear"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Death year</label>
        <UInput v-model="deathYear" />
      </div>
      <div class="flex justify-between gap-4">
        <button type="submit" 
          class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Add new
        </button>
      </div>
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
import type { Tables } from '~/types/database.types';

const { insert } = useAuthors();

const fullName = ref(null);
const birthYear = ref(null);
const deathYear = ref(null);
const selectedPhoto = ref(null);
const imagePreview = ref(null);
const photoInput = ref(null);

const handleFileUpload = (event:any) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {

  let author = {
    full_name: fullName.value,
    birth_year: birthYear.value,
    death_year: deathYear.value,
  } as Tables<'authors'>;

  if (selectedPhoto.value) {
    author = {
      ...author,
      photo: selectedPhoto.value
    }
  }

  await insert(author)
    .then(({error}) => {
      if (error) throw error;

      fullName.value = '';
      birthYear.value = '';
      deathYear.value = '';
      selectedPhoto.value = '';
      imagePreview.value = '';
      photoInput.value = '';
      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}
</script>