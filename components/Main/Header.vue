<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white"><a href="/">Look Book</a></div>
    <div class="w-1/2">
      <UInput
        icon="lucide:search"
        placeholder="Search..."
        variant="soft"
        v-model="searchTerm"
        @keyup.enter="handleSearch"
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

<script setup lang="ts">
const { signout } = useAuth();
const { userId } = useAuth();
const { bookCart } = useBookCarts();
const { updateQueryState } = useRouters();

const searchTerm = ref<string>('');

const bookCounts = computed(() => bookCart.value.length);

function handleSearch() {
  const newUrl = updateQueryState('search', searchTerm.value);
  console.log('NEW URL => ', newUrl);
}

const items = ref([
  {
    label: 'Profile',
    icon: 'lucide:user',
    to: `/reader/${userId.value}`
  },
  {
    label: 'Orders',
    icon: 'lucide:notebook-pen',
    to: '/reader/orders'
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
</script>