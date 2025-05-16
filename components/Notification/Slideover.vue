<template>
  <USlideover title="" description="">
    <UChip
      v-if="unreadNotifications.length > 0"
      :text="unreadNotifications.length"
      size="3xl"
      color="neutral"
      :ui="{ base: 'text-stone-900 bg-primary-50' }"
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
          <p
            :class="[
              'cursor-pointer',
              notificationFilter === 'all' 
                ? 'hover:bg-blue-300 bg-blue-200 px-3 rounded-lg text-blue-500 font-bold' 
                : 'hover:text-blue-500'
            ]"
            @click="setNotificationFilter('all')"
          >
            All
          </p>
          <p
            :class="[
              'cursor-pointer',
              notificationFilter === 'unread' 
                ? 'hover:bg-blue-300 bg-blue-200 px-3 rounded-lg text-blue-500 font-bold' 
                : 'hover:text-blue-500'
            ]"
            @click="setNotificationFilter('unread')"
          >
            Unread
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div v-if="status === 'success'">
        <NotificationItem
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :notification="notification"
        />
        <div v-if="filteredNotifications.length === 0" class="text-center py-4 text-gray-500">
          No notifications to display.
        </div>
      </div>
      <div
        class="flex items-center gap-3 mb-2"
        v-if="status === 'pending'"
      >
        <USkeleton class="h-10 w-[400px]" />
        <USkeleton class="h-10 w-[400px]" />
      </div>
    </template>

    <template #footer>
      <UButton
        label="See previous notifications"
        color="neutral"
        variant="outline"
        @click="loadPreviousNotifications"
        :disabled="isLoadMoreDisabled"
      />
    </template>
  </USlideover>
</template>
<script setup lang="ts">
import { DialogTitle, VisuallyHidden, DialogDescription } from 'reka-ui';
import { USER_ROLE_STAFF } from '~/constants/users';

const props = defineProps({
  toStaff: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: null
  }
});

const { index:getNotifications } = useNotifications();
const { userRole } = useAuth();

const page = ref(1);
const pageSize = ref<Number>(15);
const notificationFilter = ref('all');
const notificationOptions = ref({
  page: page.value,
  size: pageSize.value,
  toStaff: props.toStaff,
  readerId: props.userId,
});

const { data:notifications, error, status } = useAsyncData(
  computed(() => `notifications/user/${props.userId || userRole.value}/size/${pageSize.value}`).value,
  () => getNotifications(notificationOptions.value),
  { watch: [ notificationOptions.value ] }
);

const unreadNotifications = computed(() => {
  return status.value === 'success' && notifications.value?.data ? 
    notifications.value.data.filter((item: { is_read: boolean }) => !item.is_read) : 
    [];
});

const hasAllNotificationsLoaded = ref(false);

const isLoadMoreDisabled = computed(() => {
  return hasAllNotificationsLoaded.value || status.value === 'pending';
});

function loadPreviousNotifications() {
  const currentLength = notifications.value?.data?.length || 0;
  notificationOptions.value.size = Number(pageSize.value) + 5;
  
  setTimeout(() => {
    if (status.value === 'success' && notifications.value?.data) {
      if (notifications.value.data.length <= currentLength) {
        hasAllNotificationsLoaded.value = true;
      }
    }
  }, 1000);
}

function setNotificationFilter(filter: 'all' | 'unread') {
  notificationFilter.value = filter;
}

const filteredNotifications = computed(() => {
  if (!notifications.value?.data) return [];
  
  if (notificationFilter.value === 'unread') {
    return notifications.value.data.filter((item: { is_read: boolean }) => !item.is_read);
  }
  
  return notifications.value.data;
});

const channels = useSupabaseClient().channel('notification-insert-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
    },
    (payload) => {
      if (payload.new && 
        (
          payload.new.user_id === props.userId ||
          (payload.new.user_id === null && userRole.value === USER_ROLE_STAFF)
        )
      ) {
        console.log('Notification received:', payload);
        if (notifications.value?.data) {
          notifications.value.data.unshift(payload.new);
        }
      }
    }
  )
  .subscribe();
</script>