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
        Update
      </button>
    </div>
  </form>
</template>

<script setup>
import { useRouteParams } from '@vueuse/router';
const { get, update } = useCategories();
const name = ref(null);
const categoryId = useRouteParams('id', null, { transform: Number });

onMounted(async() => {
  if (categoryId.value) {
    await get(categoryId.value)
      .then(({ data }) => {
        name.value = data.name;
      })
      .catch((error) => useToastError(error));
  }
});

const submitForm = async() => {
  await update(categoryId.value, { name: name.value })
    .then(({ error }) => {
      if (error) throw error;

      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}
</script>