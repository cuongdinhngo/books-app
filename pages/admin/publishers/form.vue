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
    <h3 v-if="isLoading" class="text-stone-900">Loading ...</h3>
    <h3 v-if="errorMessage" class="text-red-500">{{ errorMessage }}</h3>
    <h3 v-if="successMessage" class="text-green-600">{{ successMessage }}</h3>
  </form>
</template>

<script setup lang="ts">
const { isLoading, publisher, processPublisher, searchPublishers } = usePublishers();
const name = ref<string|null>(null);
const selectedLogo = ref<string|null>(null);
const logoPreview = ref<string>('');
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async() => {
  const publisherId = useRoute().query?.id;
  if (publisherId) {
    const response = await searchPublishers([publisherId]);
    name.value = response[0].name;
    selectedLogo.value = null;
    logoPreview.value = response[0].logo;
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
  successMessage.value = '';
  errorMessage.value = '';

  publisher.value = {
    id: useRoute().query?.id,
    name: name.value,
  };

  if (selectedLogo.value) {
    publisher.value = {
      ...publisher.value,
      logo: selectedLogo.value
    }
  }

  const response = await processPublisher(publisher.value);
  if (response && response[0]?.id) {
    successMessage.value = 'New Publisher was created succesfully!'
  } else {
    errorMessage.value = 'Creating new Publisher was failed!'
  }
}
</script>