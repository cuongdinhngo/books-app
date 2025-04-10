<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white"><a href="/">Look Book</a></div>
    <div class="w-1/2">
      <UInput
        icon="i-lucide-search"
        placeholder="Search..."
        variant="soft"
        v-model="searchTerm"
        
      />
    </div>
    <!-- <div class="flex items-center space-x-4">
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
    </div> -->
  </header>
</template>

<script setup>
const { searchTerm } = useBooks();
const items = ref([
  {
    label: 'Profile',
    icon: 'i-lucide-user'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog'
  }
]);
</script>