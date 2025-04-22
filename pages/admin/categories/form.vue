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
    <h3 v-if="message" :class="textColor">{{ message }}</h3>
    <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
  </form>
</template>

<script setup>
const { get, insert, update } = useCategories();
const name = ref(null);
const message = ref('');
const textColor = ref('');
const { query } = useRoute();
const toast = useToast();

function showToast() {
  console.log('show toast ...', toast);
  toast.add({
    title: 'Hello!',
    description: 'This is a test toast'
  })
  console.log('toast ....');
}

onMounted(async() => {
  if (query.id) {
    const { data } = await get(Number(query.id));
    name.value = data.name;
  }
});

const submitForm = async() => {
  message.value = '';
  let error = null;
  if (query.id) {
    const { error } = await update(Number(query.id), { name: name.value });
  } else {
    const { error } = await insert({ name: name.value });
  }

  if (null === error) {
    message.value = 'New Publisher was created succesfully!';
    textColor.value = 'text-green-600';
    useToastSuccess();
  } else {
    message.value = 'Creating new Publisher was failed!';
    textColor.value = 'text-red-500';
    useToastError();
  }
}
</script>