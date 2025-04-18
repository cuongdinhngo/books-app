<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="submitForm">
    <div>
      <label class="block text-sm font-medium text-gray-700">Publisher name</label>
      <UInput v-model="name" placeholder="Publisher's name"/>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Logo</label>
      <UInput type="file" @change="handleFileUpload"/>
      <img v-if="logoPreview" :src="logoPreview" alt="Preview" class="image-preview" />
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
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'

const { query } = useRoute();
const { insert, get, update } = usePublishers();

const name = ref<string|null>(null);
const selectedLogo = ref<string|null>(null);
const logoPreview = ref<string>('');
const message = ref('');
const textColor = ref('');

onMounted(async() => {
  const publisherId = Number(query.id);
  if (publisherId) {
    const { data } = await get(publisherId);
    name.value = data?.name;
    selectedLogo.value = null;
    logoPreview.value = data?.logo;
  }
});

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

  if (query.id) {
    publisher = {
      ...publisher,
      id: Number(query.id)
    };
  }

  if (selectedLogo.value) {
    publisher = {
      ...publisher,
      logo: selectedLogo.value
    }
  }

  const { error } = query?.id ? await update(Number(query?.id), publisher) : await insert(publisher);
  if (error) {
    message.value = query?.id ? 'Publisher was updated failed!' : 'Creating new Publisher was failed!';
    textColor.value = 'text-red-500';
  } else {
    message.value = query?.id ? 'Publisher was updated succesfully!' : 'New Publisher was created succesfully!';
    textColor.value = 'text-green-600';
  }
}
</script>