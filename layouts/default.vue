<template>
  <UApp>
    <UNavigationMenu
orientation="horizontal" :items="items"
      class="data-[orientation=horizontal]:border-b border-default data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48" />
    <NuxtPage />
  </UApp>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
import type { Database } from '~/types'

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const loading = ref(false)

const items: NavigationMenuItem[][] = [
  [{ label: 'Books', icon: 'i-lucide-book-open', to: '/' }],
  [
    { label: 'Dashboard', icon: 'i-lucide-grid', to: '/admin' },
    { icon: 'i-lucide-user', label: 'Profile' },
    {
      label: 'Logout',
      onSelect: onLogout,
      icon: loading.value ? 'i-lucide-loader' : 'i-lucide-log-out',            
      disabled: loading.value
    },
  ],
]

function onLogout(e: Event) {
  e.preventDefault()
  loading.value = true
  return supabase.auth.signOut()
    .then(() => router.replace({ name: 'auth-login' }))
    .catch(console.error)
    .finally(() => {
      loading.value = false
    })
}

</script>

<style></style>
