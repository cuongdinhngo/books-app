<template>
  <div class="flex bg-white border-b-1 border-gray-200 pb-5 text-stone-900">
    <!-- Left Side: Book Cover -->
    <div class="w-1/5 flex items-center justify-center">
      <NuxtLink :to="{ name: 'admin-books-id', params: { id: book.id } }">
        <img
          :src="book.cover_image"
          :alt="book.title"
          class="object-contain h-50 w-60"
        >
      </NuxtLink>
    </div>

    <!-- Right Side: Book Details -->
    <div class="w-2/3 p-6">
      <!-- Book Title -->
      <NuxtLink :to="{ name: 'admin-books-id', params: { id: book.id } }">
        <h2 class="text-xl font-bold mb-4">{{ book.title }}</h2>
      </NuxtLink>
      <div class="flex space-x-6">
        <!-- First Column: Book ID, Reader Name -->
        <div class="w-1/2 space-y-2">
            <p>
              <span class="font-semibold mr-2">Book ID:</span>
              <USelectMenu
                v-model="bookCopyId"
                :disabled="props.order.book_copy_id"
                :items="items"
                variant="none"
                placeholder="Book ID"
                class="w-50 border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </p>
            <p>
              <span class="font-semibold">Reader:</span>
              {{ user.name }}
            </p>
            <p>
              <span class="font-semibold">Status:</span>
              {{ order.status }}
            </p>
        </div>
        <!-- Second Column: Ordered Date, Due Date, Returned Date -->
        <div class="w-1/2 space-y-2">
            <p>
              <span class="font-semibold">Ordered Date:</span> {{ useDateFormat(order.created_at, 'MMMM Do, YYYY') }}
            </p>
            <p>
              <span class="font-semibold">Due Date:</span> {{ order.due_date ? useDateFormat(order.due_date, 'MMMM Do, YYYY') : 'Waiting for approve' }}
            </p>
            <p>
              <span class="font-semibold">Returned Date:</span> {{ order.returned_at ? useDateFormat(order.returned_at, 'MMMM Do, YYYY') : 'No Information' }}
            </p>
        </div>
      </div>

      <!-- Action Selection and Timeline Button -->
      <div class="mt-4 flex items-center space-x-4">
        <UButton
          icon="lucide:send-horizontal" size="md" color="primary" variant="solid"
          @click="bookOrderModal = true"
        >
          Process
        </UButton>
        <UButton
          v-if="order.status === ORDER_STATUS.BORROWING"
          icon="lucide:notebook-pen" size="md" color="primary" variant="solid"
        >
          Extend due date
        </UButton>
        <UButton
          icon="lucide:audio-lines" size="md" color="primary" variant="solid"
        >
          Timeline Detail
        </UButton>
      </div>
    </div>

    <UModal
      title="Process Book Order"
      v-model:open="bookOrderModal"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }"
    >
      <template #body>
        <div class="flex flex-col">
          <USelectMenu
            v-model="orderStatus"
            :items="orderActionOptions"
            value-key="id"
            variant="subtle"
            placeholder="Order Status"
            class="w-50 bg-white border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UTextarea
            v-model="orderComment"
            placeholder="Type something..." class="w-full my-5" variant="subtle"
          />
          <UButton
            icon="lucide:badge-check"
            label="Submit"
            size="md"
            color="primary"
            variant="subtle"
            class="text-right"
            @click="processOrder"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES } from '~/constants/notifications';
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/constants/orders';
import { BORROWING_PERIOD } from '~/constants/rules';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  book: {
    type: Object,
    required: true
  },
  bookCopies: {
    type: Array,
    required: true
  }
});

const bookOrderModal = ref(false);
const orderComment = ref('');
const orderStatus = ref('');

const { update:updateOrder } = useOrders();
const { update:updateBookCopy } = useBookCopies();
const { insert:sendNotification } = useNotifications();

const items = computed(() => {
  if (props.order.book_copy_id) {
    return [props.order.book_copy_id]
  }

  return props.bookCopies
    .filter((copy) => copy.status === BOOK_COPY_STATUS.OPENING)
    .map((copy) => copy.id);
});
const bookCopyId = ref(items.value[0]);

const orderActionOptions = computed(() => {
  switch (props.order.status) {
    case ORDER_STATUS.WAITING:
      return [
        {label: 'Approve', id: 'borrowing'},
        {label: 'Reject', id: 'rejected'},
      ];
    case ORDER_STATUS.BORROWING:
      return [
        {label: 'Close', id: 'closed'},
        {label: 'Lost', id: 'lost'},
      ];
    default:
      return ORDER_STATUS_OPTIONS;
  }
});

const processOrder = () => {
  console.log('PROCESSING ORDER ....', props.order.id, orderStatus.value, orderComment.value);

  const currentDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(currentDate.getDate() + BORROWING_PERIOD);
  const updateOrderData = {
    book_copy_id: bookCopyId.value,
    status: orderStatus.value,
    due_date: dueDate.toISOString()
  };

  const updateBookCopyData = {
    status: getBookCopyStatusViaOrderStatus(orderStatus.value)
  };

  console.log('updateOrderData => ', updateOrderData);
  console.log('updateBookCopyData => ', updateBookCopyData);

  Promise.all([
    updateOrder(props.order.id, updateOrderData),
    updateBookCopy(bookCopyId.value, updateBookCopyData)
  ]).then(async() => {
    bookOrderModal.value = false;
    useToastSuccess(`Order #${props.order.id} was processed successfully!`)

    const { type, message } = getNotificationDetail(orderStatus.value);
    const { error:notificationError } = await sendNotification({
      user_id: props.user.id,
      type: type,
      message: message,
      notifiable_id: props.order.id,
      notifiable_type: 'orders'
    });
    if (notificationError) throw notificationError;
  }).catch((error) => useToastError(error));
}

function getNotificationDetail(orderStatus: string) {
  let type = '';
  let message = '';
  switch (orderStatus) {
    case ORDER_STATUS.BORROWING:
      type = NOTIFICATION_TYPES.ORDER_APPROVED;
      message = NOTIFICATION_MESSAGES.ORDER_APPROVED;
      break;
    case ORDER_STATUS.CLOSE:
      type = NOTIFICATION_TYPES.ORDER_CLOSED;
      message = NOTIFICATION_MESSAGES.ORDER_CLOSED;
      break;
    case ORDER_STATUS.REJECT:
      type = NOTIFICATION_TYPES.ORDER_REJECTED;
      message = NOTIFICATION_MESSAGES.ORDER_REJECTED;
      break;
  }

  return {
    type,
    message
  };
}

function getBookCopyStatusViaOrderStatus(orderStatus: string) {
  console.log('getBookCopyStatusViaOrderStatus => ', orderStatus);
  switch (orderStatus) {
    case ORDER_STATUS.BORROWING:
      return BOOK_COPY_STATUS.BORROWING;
    case ORDER_STATUS.REJECT:
      return BOOK_COPY_STATUS.OPENING;
    case ORDER_STATUS.LOST:
      return BOOK_COPY_STATUS.LOST;
  }
}

console.log('Order:', props);
</script>