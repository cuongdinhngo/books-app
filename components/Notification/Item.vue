<template>
  <NuxtLink :to="getLink()" @click="markNotificationAsRead">
    <div class="flex items-center gap-3 mb-2">
      <UChip
        v-if="!notification.is_read"
        position="top-left"
        color="success"
      >
        <UAvatar
          size="2xl"
          :src="getIcon()"
          :alt="notification.type"
        />
      </UChip>
      <UAvatar
        v-else
        size="2xl"
        :src="getIcon()"
        :alt="notification.type"
        />
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
import { publicAsset } from '../../utils';

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
      icon = 'img/calendar_clock_icon.png';
      break;
    case NOTIFICATION_TYPES.BOOK_WISHLIST:
      icon = 'img/wishlist.png';
      break;
  }

  return publicAsset(icon);
}

function getLink() {
  let link = '';
  switch(props.notification.notifiable_type) {
    case 'orders':
      link = `/reader/orders/${props.notification.notifiable_id}`;
      break;
    case 'books':
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