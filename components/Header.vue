<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white">Admin::Look Book</div>
    <div class="flex items-center space-x-4">
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
    </div>
  </header>
</template>

<script setup>
import { DialogTitle, VisuallyHidden, DialogDescription } from 'reka-ui';

const { signout, userId } = useAuth();
const items = ref([
  {
    label: 'Profile',
    icon: 'lucide:user',
    to: { name: 'admin-staff-id', params: { id: userId.value }}
  },
  {
    label: 'Logout',
    icon: 'lucide:log-out',
    async onSelect() {
      await signout();
      navigateTo('/login')
    }
  }
]);

const { data:notifications, error } = await useAsyncData(
  `admin-notifications`,
  () => useTable('notifications').select().is('user_id', null).order('created_at', { ascending: false })
);

const unreadNotificaitons = computed(() => notifications.value.data.filter(item => !item.is_read));
</script>