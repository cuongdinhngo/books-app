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

  <USlideover title="" description="">
    <UChip
      v-if="unreadNotificaitons.length > 0"
      :text="unreadNotificaitons.length"
      size="3xl"
      color="neutral"
      :ui="{
        base: 'text-stone-900 bg-primary-50',
      }"
    >
      <UButton
        icon="lucide:bell"
        color="neutral"
        variant="outline"
        class="ring-0 bg-primary-800 text-lg cursor-pointer"
      />
    </UChip>
    <UButton
      v-else
      icon="lucide:bell"
      color="neutral"
      variant="outline"
      class="ring-0 bg-primary-800 text-lg cursor-pointer"
    />

    <template #header>
      <div>
        <DialogTitle class="text-lg font-semibold mb-2">Notifications</DialogTitle>
        <VisuallyHidden>
          <DialogDescription>This panel shows notification filters and recent alerts.</DialogDescription>
        </VisuallyHidden>
        <div class="flex space-x-4">
          <p class="cursor-pointer hover:bg-blue-300 bg-blue-200 px-3 rounded-lg text-blue-500 font-bold">All</p>
          <p class="cursor-pointer hover:text-blue-500">Unread</p>
        </div>
      </div>
    </template>

    <template #body>
      <NotificationItem
        v-for="notification in notifications.data"
        :key="notification.id"
        :notification="notification"
      />
    </template>
  </USlideover>

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
import { DialogTitle, VisuallyHidden, DialogDescription } from 'reka-ui';

const { signout } = useAuth();
const { userId } = useAuth();
const { bookCart } = useBookCarts();
const { index:getNotifications } = useNotifications();

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

const bookCounts = computed(() => bookCart.value.length);

const { data:notifications, error } = await useAsyncData(
  `reader-${userId.value}-notifications`,
  () => getNotifications()
);

const unreadNotificaitons = computed(() => notifications.value.data.filter(item => !item.is_read));
</script>