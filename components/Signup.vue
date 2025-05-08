<template>
  <form class="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4 text-stone-950" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold text-center">Create new account</h2>
    <div>
      <label for="fullname" class="block text-sm font-medium text-gray-700">Full name</label>
      <input type="text" id="fullname" v-model="fullName"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your full name">
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700">Phone</label>
      <input type="text" id="address" v-model="phone"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter address">
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input type="email" id="email" name="email" v-model="email"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter email">
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input type="password" id="password" name="password" v-model="password"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter password">
    </div>
    <div>
      <button type="submit" 
              class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Signup
      </button>
    </div>
    <p class="text-center text-sm text-gray-600">
        Already have an account. Let go to <NuxtLink to="/login" class="text-blue-600 hover:underline">signin</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import type { Tables } from '~/types/database.types';
const { insert } = useUsers();
const { signup, setAuthenticatedUser } = useAuth();

const fullName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = async() => {
  await signup(email.value, password.value)
    .then(async({data:authData, error:authError}) => {
      if (authError) throw authError;

      const reader = {
        id: authData.user?.id,
        name: fullName.value,
        phone: phone.value,
        email: email.value
      };

      const { data, error:insertError } = await insert(reader);
      if (insertError) throw insertError;

      setAuthenticatedUser(authData),
      useToastSuccess();
      navigateTo('/');
    })
    .catch((error) => useToastError(error));
}
</script>