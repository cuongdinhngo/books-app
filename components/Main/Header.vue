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
    <div class="flex items-center space-x-4">
      <UChip
        v-if="bookCounts > 0"
        :text="bookCounts"
        size="3xl"
        color="neutral"
        :ui="{
          base: 'text-stone-900 bg-primary-50',
        }"
      >
        <UButton
          icon="lucide:shopping-cart"
          color="neutral"
          variant="outline"
          class="ring-0 bg-primary-800 text-lg cursor-pointer"
          @click="navigateTo('/book/cart')"
        />
      </UChip>
      <UButton
        v-else
        icon="lucide:shopping-cart"
        color="neutral"
        variant="outline"
        class="ring-0 bg-primary-800 text-lg cursor-pointer"
        @click="navigateTo('/book/cart')"
      />
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
const { signout } = useAuth();
const searchTerm = useSearchTerm();
const items = ref([
  {
    label: 'Profile',
    icon: 'i-lucide-user'
  },
  {
    label: 'Orders',
    icon: 'lucide:notebook-pen',
    to: '/reader/orders'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog'
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

const { bookCart } = useBookCarts();

const bookCounts = computed(() => bookCart.value.length);

console.log('CHECKING MAIN PAGE LOADING ....');
</script>