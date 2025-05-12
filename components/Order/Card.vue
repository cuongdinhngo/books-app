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
              :disabled="props.order.book_copy_id !== null"
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
            <span class="font-semibold">Ordered No:</span> #{{ props.order.id }}
          </p>
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
          v-if="order.status === ORDER_STATUS.BORROWING && requestOrderRenews === null"
          icon="lucide:notebook-pen" size="md" color="primary" variant="solid"
          @click="dueDateModal = true"
        >
          Extend due date
        </UButton>
        <UButton
          v-if="order.status === ORDER_STATUS.BORROWING && requestOrderRenews?.status === ORDER_RENEWS_STATUS.WAITING"
          icon="lucide:notebook-pen" size="md" color="primary" variant="solid"
          @click="confirmDueDateModal = true"
        >
          Confirm due date
        </UButton>
        <UButton
          icon="lucide:audio-lines" size="md" color="primary" variant="solid"
          @click="timelineModal = true"
        >
          Timeline Detail
        </UButton>
      </div>
    </div>

    <!-- Process Book Order Modal -->
    <UModal
      :title="`#${props.order.id}: Extend Due date`"
      v-model:open="bookOrderModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full'}"
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

    <!-- Extend Due date Modal -->
    <UModal
      :title="`#${props.order.id}: Extend Due date`"
      v-model:open="dueDateModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full'}"
    >
      <template #body>
        <div class="flex flex-col">
          <UInput
            type="date"
            v-model="newDueDate"
          />
          <UTextarea
            v-model="dueDateComment"
            placeholder="Type something..." class="w-full my-5" variant="subtle"
          />
          <UButton
            icon="lucide:badge-check"
            label="Submit"
            size="md"
            color="primary"
            variant="subtle"
            class="text-right"
            @click="extendDueDate"
          />
        </div>
      </template>
    </UModal>

    <!-- Confirm Due date Modal -->
    <UModal
      :title="`#${props.order.id}: Confirm Due date`"
      v-model:open="confirmDueDateModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full'}"
    >
      <template #body>
        <div class="flex flex-col">
          <p class="my-1">
            <span class="font-semibold">Old due Date:</span>
            {{ useDateFormat(requestOrderRenews.old_due_date, 'MMMM Do, YYYY') }}
          </p>
          <p class="my-1">
            <span class="font-semibold">New due Date:</span>
            {{ useDateFormat(requestOrderRenews.new_due_date, 'MMMM Do, YYYY') }}
          </p>
          <p class="my-1">
            <span class="font-semibold">Request note:</span>
            {{ requestOrderRenews.request_note }}
          </p>
          <USelectMenu
            v-model="orderRenewStatus"
            :items="[
              {label: 'Approve', id: 'approved'},
              {label: 'Reject', id: 'rejected'},
            ]"
            value-key="id"
            variant="subtle"
            placeholder="Approve or Reject"
            class="w-50 my-1 bg-white border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <UTextarea
            v-model="orderRenewComment"
            placeholder="Leave comment ..." class="w-full my-5" variant="subtle"
          />
          <UButton
            icon="lucide:badge-check"
            label="Submit"
            size="md"
            color="primary"
            variant="subtle"
            class="text-right"
            @click="handleOrderRenew"
          />
        </div>
      </template>
    </UModal>

    <!-- Order Timeline Modal -->
    <UModal
      :title="`#${props.order.id}: Timeline`"
      v-model:open="timelineModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full'}"
    >
      <template #body>
        <UStepper orientation="vertical" :items="timelineItems" class="w-full" />
      </template>
    </UModal>

  </div>
</template>
<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES } from '~/constants/notifications';
import { ORDER_RENEWS_STATUS } from '~/constants/orderRenews';
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/constants/orders';
import { BORROWING_PERIOD } from '~/constants/rules';
import { TIMELINE_ACTIONS, TIMELINE_TYPES } from '~/constants/orderTimeline';

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
  },
  orderRenews: {
    type: Array,
    required: true
  },
  timeline: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['refreshOrders']);

console.log('ORDER CARD => ', props);

const bookOrderModal = ref(false);
const orderComment = ref('');
const orderStatus = ref('');
const dueDateModal = ref(false);
const newDueDate = ref('');
const dueDateComment = ref('');
const orderRenewStatus = ref('');
const orderRenewComment = ref('');
const confirmDueDateModal = ref(false);
const timelineModal = ref(false);

const { update:updateOrder } = useOrders();
const { update:updateBookCopy } = useBookCopies();
const { insert:sendNotification, getNotificationByOrderStatus } = useNotifications();
const { insert:insertNewDueDate, update:updateOrderRenew } = useOrderRenews();
const { insert:createOrderTimeline} = useOrderTimeline();
const { userId } = useAuth();

const timelineItems = computed(() => {
  return props.timeline.map((item: StepperItem) => {
    const action = TIMELINE_ACTIONS.filter(action => item.action === action.type)[0];
    console.log('timeline action => ', action);
    return {
      ...action,
      description: action.description.replace('#dateTime', useDateFormat(action.created_at, 'MMMM Do, YYYY').value),
    }
  });
});
console.log('timelineItems => ', timelineItems.value); 

const items = computed(() => {
  if (props.order.book_copy_id) {
    return [props.order.book_copy_id]
  }

  return props.bookCopies
    .filter((copy) => copy.status === BOOK_COPY_STATUS.OPENING)
    .map((copy) => copy.id);
});
const bookCopyId = ref(items.value[0]);

const requestOrderRenews = computed(() => {
  const newRequests = props.orderRenews
    .filter((item) => item.status === ORDER_RENEWS_STATUS.WAITING);

  return newRequests.length > 0 ? newRequests[0] : null;
});
console.log('requestOrderRenews => ', requestOrderRenews.value);

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

const handleOrderRenew = async() => {
  if (orderRenewStatus.value === ORDER_RENEWS_STATUS.REJECTED) {
    const { error } = await updateOrderRenew(props.order.id, { status: orderRenewStatus.value});
    if (error) {
      useToastError(error);
      return;
    }

    const { error:timelineError } = await createOrderTimeline({
      order_id: props.order.id,
      action: getTimelineTypeViaOrderStatus(NOTIFICATION_TYPES.REJECTED_REQUEST_DUE_DATE),
      user_id: userId.value
    });

    confirmDueDateModal.value = false;
    useToastSuccess('Order renew request was rejected successfully!');
    emit('refreshOrders');
    return;
  }

  Promise.all([
    updateOrder(props.order.id, { due_date: requestOrderRenews.value.new_due_date }),
    updateOrderRenew(requestOrderRenews.value.id, { status: orderRenewStatus.value, comment: orderRenewComment.value })
  ])
  .then(async({ error }) => {
    if (error) throw error;

    const { error:notificationError } = await sendNotification({
      user_id: props.user.id,
      type: NOTIFICATION_TYPES.APPROVED_EXTEND_DUE_DATE,
      message: NOTIFICATION_MESSAGES.APPROVED_EXTEND_DUE_DATE,
      notifiable_id: props.order.id,
      notifiable_type: 'orders'
    });

    const { error:timelineError } = await createOrderTimeline({
      order_id: props.order.id,
      action: getTimelineTypeViaOrderStatus(NOTIFICATION_TYPES.APPROVED_EXTEND_DUE_DATE),
      user_id: userId.value
    });
    useToastSuccess(`Order #${props.order.id} was rejected!`);
    confirmDueDateModal.value = false;
    emit('refreshOrders');
  })
  .catch((error) => useToastError(error));
}

const extendDueDate = () => {
  console.log('Extend Due date');
  const data = {
    order_id: props.order.id,
    new_due_date: newDueDate.value,
    old_due_date: props.order.due_date,
    comment: dueDateComment.value
  }

  Promise.all([
    insertNewDueDate(data),
    updateOrder(props.order.id, { due_date: newDueDate.value })
  ])
  .then(async({ error }) => {
    if (error) throw error;

    const { error:notificationError } = await sendNotification(
      {
        user_id: props.user.id,
        type: NOTIFICATION_TYPES.STAFF_EXTEND_DUE_DATE,
        message: NOTIFICATION_MESSAGES.STAFF_EXTEND_DUE_DATE,
        notifiable_id: props.order.id,
        notifiable_type: 'orders'
      }
    );

    const { error:timelineError } = await createOrderTimeline({
      order_id: props.order.id,
      action: getTimelineTypeViaOrderStatus(NOTIFICATION_TYPES.STAFF_EXTEND_DUE_DATE),
      user_id: userId.value
    });

    dueDateModal.value = false;
    newDueDate.value = '';
    dueDateComment.value = '';
    useToastSuccess(`Order #${props.order.id} was extended due date successfully!`);
    emit('refreshOrders');
  })
  .catch((error) => useToastError(error));
}

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
    emit('refreshOrders');

    const { type, message } = getBookCopyStatusViaOrderStatus(orderStatus.value);
    const { error:notificationError } = await sendNotification({
      user_id: props.user.id,
      type: type,
      message: message,
      notifiable_id: props.order.id,
      notifiable_type: 'orders'
    });
    if (notificationError) throw notificationError;

    const { error:timelineError } = await createOrderTimeline({
      order_id: props.order.id,
      action: getTimelineTypeViaOrderStatus(orderStatus.value),
      user_id: userId.value
    });
    if (timelineError) throw timelineError;
  }).catch((error) => useToastError(error));
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
    case ORDER_STATUS.CLOSE:
      return BOOK_COPY_STATUS.OPENING;
  }
}

function getTimelineTypeViaOrderStatus(orderStatus: string) {
  switch (orderStatus) {
    case ORDER_STATUS.BORROWING:
      return TIMELINE_TYPES.ORDER_APPROVED;
    case ORDER_STATUS.REJECT:
      return TIMELINE_TYPES.ORDER_REJECTED;
    case ORDER_STATUS.LOST:
      return TIMELINE_TYPES.ORDER_CLOSED;
    case ORDER_STATUS.CLOSE:
      return TIMELINE_TYPES.ORDER_CLOSED;
    case NOTIFICATION_TYPES.STAFF_EXTEND_DUE_DATE:
      return TIMELINE_TYPES.ORDER_EXTENDED;
    case NOTIFICATION_TYPES.APPROVED_EXTEND_DUE_DATE:
      return TIMELINE_TYPES.ORDER_REQUEST_APPROVED;
    case NOTIFICATION_TYPES.REJECTED_REQUEST_DUE_DATE:
      return TIMELINE_TYPES.ORDER_REQUEST_REJECTED
  }
}
</script>