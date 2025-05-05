<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-1/2" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Author name</label>
        <UInput
          v-model="fullName"
          placeholder="Author's fullname"
          variant="subtle"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Photo</label>
        <UInput
          type="file"
          @change="handleFileUpload"
          v-model="photoInput"
          variant="subtle"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Birth year</label>
        <UInput
          v-model="birthYear"
          variant="subtle"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Death year</label>
        <UInput
          v-model="deathYear"
          variant="subtle"
        />
      </div>
      <div class="flex justify-between gap-4">
        <button type="submit" 
          class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          Update
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
import { useRouteParams } from '@vueuse/router';
const { update, get } = useAuthors();

const authorId = useRouteParams('id', null, {transform: Number});
const fullName = ref('');
const birthYear = ref('');
const deathYear = ref('');
const selectedPhoto = ref<File | null>(null);
const imagePreview = ref('');
const photoInput = ref('');

const { data:author, error, refresh} = await useAsyncData(
 `author-${authorId.value}`,
  () => get(authorId.value)
);

fullName.value = author?.value.data.full_name;
birthYear.value = author?.value.data.birth_year;
deathYear.value = author?.value.data.death_year;
imagePreview.value = author?.value.data.photo;

const handleFileUpload = (event: Event) => {
  const file = event.target?.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  let author = {
    id: Number(authorId.value),
    full_name: fullName.value,
    birth_year: birthYear.value ? Number(birthYear.value) : null,
    death_year: deathYear.value ? Number(deathYear.value) : null,
  } as Tables<'authors'>;


  if (selectedPhoto.value) {
    author = {
      ...author,
      photo: selectedPhoto.value
    }
  }

  await update(authorId.value, author)
    .then(({error}) => {
      if (error) throw error;

      useToastSuccess('Author updated successfully!!!');
    })
    .catch((error) => useToastError(error));
}
</script>