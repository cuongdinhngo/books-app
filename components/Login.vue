<template>
  <!-- Login Form -->
  <form class="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4 text-stone-950" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-bold text-center">Login</h2>
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
          Login
      </button>
    </div>
    <h3 v-if="error" class="text-center text-red-700">{{ error }}</h3>
    <p class="text-center text-sm text-gray-600">
        Don’t have an account? <NuxtLink to="/signup" class="text-blue-600 hover:underline">Register</NuxtLink>
    </p>
    <p>Staff: thi@local.test / 1234567890</p>
    <p>Reader: blue@local.test / 1234567890</p>
  </form>
</template>

<script setup>
const { signin, userRole } = useAuth();
const email = ref('');
const password = ref('');

const handleSubmit = async() => {
  if (email.value.trim() && password.value.trim()) {
    await signin({email: email.value, password: password.value})
      .then(() => {
        if (userRole.value === 'staff') navigateTo('/admin/');
        else navigateTo('/');
      })
      .catch((error) => useToastError(error));
  }
}
</script>