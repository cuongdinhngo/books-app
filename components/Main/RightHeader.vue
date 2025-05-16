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

  <UButton
    v-if="false === isAuthenticated"
    icon="lucide:log-in"
    color="neutral"
    variant="outline"
    class="ring-0 bg-primary-800 text-lg cursor-pointer"
    @click="navigateTo('/login')"
  />

  <NotificationSlideover
    v-if="isAuthenticated"
    :to-staff="false"
    :user-id="userId"
  />

  <UDropdownMenu
    v-if="isAuthenticated"
    class="bg-primary-600 border-primary-900 hover:bg-primary-700"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 1
    }"
    :ui="{
      content: 'w-40'
    }"
    :items="[
      {
        label: 'Profile',
        icon: 'lucide:user',
        to: `/reader/${userId}`
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
          await signout();
          navigateTo('/login')
        }
      }
    ]"
  >
    <UButton icon="lucide:settings" color="neutral" variant="outline" class="ring-0 bg-primary-800 text-lg" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { DialogTitle, VisuallyHidden, DialogDescription } from 'reka-ui';

const { signout } = useAuth();
const { userId } = useAuth();
const { bookCart } = useBookCarts();
const { get:getNotifications } = useNotifications();

const bookCounts = computed(() => bookCart.value.length);
const isAuthenticated = computed(() => !!userId.value);

const { data:notifications, error } = await useAsyncData(
  `reader/${userId.value}/notifications`,
  async() => {
    if (userId.value) {
      return await getNotifications(userId.value)
    } else {
      return { data: [] }
    }
  }
);

const unreadNotificaitons = computed(() => notifications.value.data?.filter(item => !item.is_read));
</script>