<template>
  <UCard>
    <template #header>
      Login
    </template>
    <UForm id="form" :state="state" @submit.prevent="onSubmit">
      <UFormField label="Email">
        <UInput v-model="state.email" placeholder="Enter your email" />
      </UFormField>
      <UFormField label="Password">
        <UInput v-model="state.password" type="password" placeholder="Enter your password" />
      </UFormField>
    </UForm>
    <template #footer>
      <UButton type="submit" form="form" :loading>Login</UButton>
      <UButton>Register</UButton>
    </template>
  </UCard>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'fullscreen'
})

const supabase = useSupabaseClient()

const state = reactive({
  email: 'thi@local.test',
  password: '1234567890',
})

const loading = ref(false)


function onSubmit() {
  loading.value = true

  return supabase.auth.signInWithPassword(state)
    .then(({ data }) => {
      if (data.user) {
        navigateTo({ name: 'index' })
      }
    })
    .catch(error => console.error(error))
    .finally(() => {
      loading.value = false
    })
}
</script>

<style></style>
