<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white">Admin::Look Book</div>
    <div class="flex items-center space-x-4">
      <UDropdownMenu
        class="bg-primary-600 border-primary-900 hover:bg-primary-700"
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 1
        }"
        :ui="{
          content: 'w-40'
        }"
      >
        <UButton icon="lucide:settings" color="neutral" variant="outline" class="ring-0 bg-primary-800 text-lg" />
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup>
const { signout, userId } = useAuth();
const items = ref([
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    to: `/admin/staff/${userId.value}`
  },
  {
    label: 'Logout',
    icon: 'lucide:log-out',
    async onSelect() {
      signout();
      navigateTo('/login')
    }
  }
]);

console.log('CHECKING PAGE LOADING ....');
</script>