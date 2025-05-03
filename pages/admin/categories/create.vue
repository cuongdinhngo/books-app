<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="submitForm">
    <div>
      <label class="block text-sm font-medium text-gray-700">Category name</label>
      <UInput v-model="name" placeholder="Category's name" variant="subtle"/>
    </div>
    <div class="flex justify-between gap-4">
      <button type="submit" 
        class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Add new
      </button>
    </div>
  </form>
</template>

<script setup>
const { insert } = useCategories();
const name = ref(null);

const submitForm = async() => {
  await insert({ name: name.value })
    .then(() => {
      useToastSuccess();
      name.value = '';
    })
    .catch((error) => useToastError(error));
}
</script>