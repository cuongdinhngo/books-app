<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-1/2" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700">Full name</label>
        <input
          v-model="name"
          variant="subtle"
          type="text"
          placeholder="Enter full name"
          class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-900">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          variant="subtle"
          type="text"
          placeholder="Enter email"
          class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-900">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Profile photo</label>
        <input
          @change="handlePhoto"
          variant="subtle"
          type="file"
          placeholder="Select profile photo"
          class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-900">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="password"
          variant="subtle"
          type="password"
          placeholder="Enter password"
          class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-900">
      </div>

      <FormButtonDiv
        :label="useRoute().query?.id ? 'Update' : 'Add new'"
      />
    </form>

    <!-- Photo Preview -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <FormPhotoReview
        :image-preview="photoPreview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';
import { USER_ROLE_STAFF } from '~/constants/users';

const { insert } = useStaff();
const { signup } = useAuth();

const name = ref<string>('');
const email = ref<string>('');
const photo = ref<string>('');
const photoPreview = ref<string>('');
const password = ref<string>('');

function handlePhoto(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    photo.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

async function submitForm() {
  let staff = {
    name: name.value,
    email: email.value,
    role: USER_ROLE_STAFF
  } as Tables<'users'>;

  if (photo.value) {
    staff = {
      ...staff,
      photo: photo.value
    };
  }

  await signup(email.value, password.value)
    .then(async({ data, error }) => {
      const userId = data.user?.id;
      staff = {
        ...staff,
        id: userId
      }
      const { error:insertError } = await insert(staff);
      if (insertError) throw insertError;

      name.value = '';
      email.value = '';
      password.value = '';
      photo.value = '';
      useToastSuccess();
    })
    .catch((error) => useToastError(error));
}
</script>