<template>
  <NuxtLink :to="getLink()" @click="markNotificationAsRead">
    <div class="flex items-center gap-3 mb-2">
      <UChip :position="!notification.is_read ? 'top-left' : ''" :color="!notification.is_read ? 'success' : ''">
        <UAvatar
          size="2xl"
          :src="getIcon()"
          :alt="notification.type"
        />
      </UChip>
      <div>
        <p class="font-medium text-highlighted text-sm">
          {{ message }}
        </p>
        <p class="text-sm font-bold text-primary-400">
          {{ formatTimeSince(notification.created_at) }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { NOTIFICATION_TYPES } from '~/composables/notifications';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const { update } = useNotifications();

const message = computed(() => props.notification.message.replace('#{orderId}', `#${props.notification.notifiable_id}`));

function getIcon() {
  let icon = '';
  switch(props.notification.type) {
    case NOTIFICATION_TYPES.ORDER_OVERDUE:
      icon = '/img/calendar_clock_icon.png';
      break;
    case NOTIFICATION_TYPES.WISHLIST:
      icon = '/img/wishlist.png';
      break;
  }

  return icon;
}

function getLink() {
  let link = '';
  switch(props.notification.notifiable_type) {
    case 'orders':
      link = `/reader/orders/${props.notification.notifiable_id}`;
      break;
    case 'wishlist':
      link = `/book/${props.notification.notifiable_id}`;
      break;
  }

  return link;
}

async function markNotificationAsRead() {
  if (props.notification.is_read) {
    return;
  }

  await update(props.notification.id, { is_read: true })
    .then(({ error }) => {
      if (error) throw error;
    })
    .catch((error) => useToastError(error));
}
</script>