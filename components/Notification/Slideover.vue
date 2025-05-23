<template>
  <USlideover title="" description="">
    <UChip
      v-if="unreadNotificationCounts > 0"
      size="3xl"
      color="success"
    >
      <UButton
        icon="lucide:bell"
        color="neutral"
        variant="outline"
        class="ring-0 bg-primary-800 text-lg cursor-pointer"
        @click=""
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
            @click="fetchNotifications('all')"
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
            @click="fetchNotifications('unread')"
          >
            Unread
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div v-if="status === 'success'">
        <NotificationItem
          v-for="notification in notifications.data"
          :key="notification.id"
          :notification="notification"
        />
        <div v-if="notifications.count === 0" class="text-center py-4 text-gray-500">
          No unread notifications.
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
  },
  unreadCounts: {
    type: Number,
    default: 0
  }
});

const { index:getNotifications } = useNotifications();
const { userRole } = useAuth();

const unreadNotificationCounts = ref(props.unreadCounts);
const page = ref<Number|null>(1);
const pageSize = ref<Number|null>(15);
const isRead = ref<Boolean|null>(null);
const notificationFilter = ref('all');
const notificationOptions = ref({
  page: page.value,
  size: pageSize.value,
  toStaff: props.toStaff,
  readerId: props.userId,
  isRead: isRead.value
});

const { data:notifications, error, status } = await useAsyncData(
  `notifications?toStaff=${props.toStaff}&readerId=${props.userId}&isRead=${isRead.value}&page=${page.value}`,
  () => getNotifications(notificationOptions.value),
  { watch: [ notificationOptions.value ] }
);

function fetchNotifications(status: 'all' | 'unread') {
  if (status === 'unread') {
    notificationFilter.value = 'unread';
    notificationOptions.value.isRead = false;
    notificationOptions.value.page = null;
    notificationOptions.value.size = null;
  } else {
    notificationFilter.value = 'all';
    notificationOptions.value.isRead = null;
    notificationOptions.value.page = page.value;
    notificationOptions.value.size = pageSize.value;
  }
}

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
        unreadNotificationCounts.value += 1;
        if (notifications.value?.data) {
          notifications.value.data.unshift(payload.new);
        }
        useToastSuccess('You have a new notification. Please check it!');
      }
    }
  )
  .subscribe();
</script>