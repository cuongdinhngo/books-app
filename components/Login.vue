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
    <p class="text-center text-sm text-gray-600">
        Don’t have an account? <a href="#" class="text-blue-600 hover:underline">Register</a>
    </p>
  </form>
</template>

<script setup>
// const { login, storeUser } = useUsers();
const { signin, token } = useAuth();
const email = ref('');
const password = ref('');

const handleSubmit = async() => {
  console.log('handleSubmit ....');
  if (email.value.trim() && password.value.trim()) {
    try {
      const response = await signin({email: email.value, password: password.value});
      console.log('TOKEN => ', token.value);
      if (token) {
        navigateTo('admin/books?page=1#with-links');
      }
    } catch (error) {
      alert('Login failed')
    }
  }
}
</script>