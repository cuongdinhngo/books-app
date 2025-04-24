<template>
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
</template>

<script setup lang="ts">
const { signout } = useAuth();
const { userId } = useAuth();
const { bookCart } = useBookCarts();

const bookCounts = computed(() => bookCart.value.length);

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