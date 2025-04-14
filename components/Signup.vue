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
      <label for="birthday" class="block text-sm font-medium text-gray-700">Birthday</label>
      <input type="text" id="birthday" v-model="birthday"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your birthday YYYY-MM-DD">
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
      <input type="text" id="address" v-model="address"
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
    <h3 v-if="isLoading" class="text-center text-stone-900">Processing ...</h3>
    <h3 v-if="error" class="text-center text-red-800">{{ error }}</h3>
    <p class="text-center text-sm text-gray-600">
        Already have an account. Let go to <a href="/login" class="text-blue-600 hover:underline">signin</a>
    </p>
  </form>
</template>

<script setup>
const { createReader, isLoading, error } = useReaders();

const fullName = ref('');
const birthday = ref('');
const address = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = async() => {
  const reader = {
    fullName: fullName.value,
    birthday: birthday.value,
    address: address.value,
    email: email.value,
    password: password.value
  };

  const response = await createReader(reader);
  if (response) {
    navigateTo('/');
  }
}
</script>