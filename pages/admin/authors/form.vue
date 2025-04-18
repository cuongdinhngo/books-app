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
      <h3 v-if="message" :class="textColor">{{ message }}</h3>
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
const { insert, update, get } = useAuthors();
const fullName = ref(null);
const birthYear = ref(null);
const deathYear = ref(null);
const selectedPhoto = ref(null);
const imagePreview = ref(null);
const message = ref('');
const textColor = ref('');
const { query } = useRoute();

onMounted(async() => {
  const authorId = Number(query?.id);
  if (authorId) {
    const { data } = await get(authorId);
    fullName.value = data?.full_name;
    birthYear.value = data?.birth_year;
    deathYear.value = data?.death_year;
    imagePreview.value = data?.photo;
    selectedPhoto.value = null;
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

  let author = {
    full_name: fullName.value,
    birth_year: birthYear.value,
    death_year: deathYear.value,
  } as Tables<'authors'>;

  if (query.id) {
    author = {
      ...author,
      id: Number(query.id)
    };
  }

  if (selectedPhoto.value) {
    author = {
      ...author,
      photo: selectedPhoto.value
    }
  }

  const { error } = query.id ? await update(query.id, author) : await insert(author); 
  if (error) {
    console.log('ERROR => ', error);
    message.value = query?.id ? 'Author was updated failed!' : 'Creating new Author was failed!';
    textColor.value = 'text-red-500';
  } else {
    message.value = query?.id ? 'Author was updated succesfully!' : 'New Author was created succesfully!';
    textColor.value = 'text-green-600';
  }
}
</script>