<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="submitForm">
    <div>
      <label class="block text-sm font-medium text-gray-700">Category name</label>
      <UInput v-model="name" placeholder="Category's name"/>
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

<script setup>
const { category, isLoading, processCategory, searchCategories } = useCategories();
const name = ref(null);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async() => {
  const categoryId = useRoute().query?.id;
  if (categoryId) {
    const response = await searchCategories([categoryId]);
    name.value = response[0].name;
  }
});

const submitForm = async() => {
  successMessage.value = '';
  errorMessage.value = '';

  category.value = {
    id: useRoute().query?.id,
    name: name.value,
  };

  const response = await processCategory(category.value);
  if (response && response[0]?.id) {
    successMessage.value = 'New Publisher was created succesfully!'
  } else {
    errorMessage.value = 'Creating new Publisher was failed!'
  }
}
</script>