<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-2/3" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Publisher name</label>
        <UInput v-model="name" placeholder="Publisher's name" variant="subtle"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Logo</label>
        <UInput type="file" @change="handleFileUpload" variant="subtle"/>
      </div>
      <div class="flex justify-between gap-4">
        <button type="submit" 
          class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {{ useRoute().query?.id ? 'Update' : 'Add new' }}
        </button>
      </div>
    </form>
    
    <!-- Photo Preview -->
    <div class="w-full md:w-1/3 flex items-center justify-center">
      <div
        id="photo-frame" 
        class="w-60 h-50 bg-gray-100 border-2 border-solid border-gray-400 rounded-lg shadow flex items-center justify-center overflow-hidden"
      >
        <img
          v-if="logoPreview"
          :src="logoPreview"
          alt="Photo Preview" 
          class="max-w-full h-auto rounded-lg shadow"
        />
        <span v-else id="placeholder-text" class="text-gray-500 text-sm">No Logo</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'

const { insert } = usePublishers();

const name = ref<string|null>(null);
const selectedLogo = ref<string|null>(null);
const logoPreview = ref<string>('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedLogo.value = file;
    logoPreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  let publisher = {
    name: name.value,
  } as Tables<'publishers'>

  if (selectedLogo.value) {
    publisher = {
      ...publisher,
      logo: selectedLogo.value
    }
  }

  await insert(publisher)
    .then(({ error }) => {
      if (error) throw error;

      name.value = '';
      selectedLogo.value = '';
      logoPreview.value = '';
      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}
</script>