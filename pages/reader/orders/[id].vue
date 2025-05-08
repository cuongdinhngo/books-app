<template>
  <!-- Information Block -->
  <div class="p-4">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold text-gray-800">Borrowing Information</h3>
      <button
        v-if="order?.status === ORDER_STATUS.BORROWING"
        @click="openDueDateModal = !openDueDateModal"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
          Request Extend
      </button>
    </div>
    <div class="space-y-2">
        <p class="text-gray-600">
          Status: <span class="font-semibold"> {{ order?.status }}</span>
          <UBadge
            v-if="order?.status === ORDER_ITEM_STATUS.BORROWING && new Date() > new Date(order?.due_date)"
            color="warning" variant="solid"
            class="ml-4"
          >
            Overdue
          </UBadge>
        </p>

        <p class="text-gray-600" v-if="order?.comment">Reason:
          <span class="font-semibold">
            {{ order?.comment }}
          </span>
        </p>

        <p class="text-gray-600">Quantity:
          <span class="font-semibold">
            {{ order?.order_items.length }}
          </span>
        </p>

        <p class="text-gray-600">Booked at:
          <span class="font-semibold">
            {{ order?.created_at ? useDateFormat(order?.created_at, 'MMMM Do, YYYY') : ''}}
          </span>
        </p>

        <p v-if="order?.due_date" class="text-gray-600">Due date:
          <span class="font-semibold">
            {{ useDateFormat(order?.due_date, 'MMMM Do, YYYY') }}
          </span>
        </p>

        <p class="text-gray-600">Returned at:
          <span class="font-semibold">
            {{ order?.returned_at ? useDateFormat(order?.returned_at, 'MMMM Do, YYYY') : 'Not yet returned' }}
          </span>
        </p>
    </div>

    <!-- Extend Due date Modal -->
    <UModal
      v-model:open="openDueDateModal"
      title="Extend due date"
    >
      <template #body>
        <div class="flex flex-col">
          <UInput v-model="orderRenewComment" placeholder="Enter note" class="mb-5"/>
          <UInput v-model="orderRenewDueDate" placeholder="Enter extended date" type="date"/>
        </div>
      </template>

      <template #footer>
        <UButton label="Cancel" color="neutral" variant="outline" @click="openDueDateModal = false" />
        <UButton label="Submit" color="neutral" @click="handleRenew"/>
      </template>
    </UModal>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <BookCard
      v-for="book in bookItems"
      :key="book.id"
      :book="book"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useRouteParams } from '@vueuse/router';
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from '~/constants/notifications';
import { ORDER_STATUS } from '~/constants/orders';

const { get, renew:extendDueDate, update } = useOrders();
const { index:getBooksItems } = useBookCopies();
const { userId } = useAuth();
const { insert } = useNotifications();

const orderId = useRouteParams('id');
const order = ref(null);
const bookItems = ref(null);
const openDueDateModal = ref(false);
const orderRenewComment = ref('');
const orderRenewDueDate = ref('');

async function handleRenew() {
  await extendDueDate({
      order_id: orderId.value,
      reader_id: userId.value,
      new_due_date: orderRenewDueDate.value,
      request_note: orderRenewComment.value
    })
  .then(async({ error }) => {
    if (error) throw error;

    const { error:notificationError } = await insert({
      type: NOTIFICATION_TYPES.REQUEST_EXTEND_DUE_DATE,
      message: NOTIFICATION_MESSAGES.REQUEST_EXTEND_DUE_DATE,
      notifiable_id: orderId.value,
      notifiable_type: 'orders'
    });
    if (notificationError) throw notificationError;

    orderRenewComment.value = '';
    orderRenewDueDate.value = '';
    openDueDateModal.value = false;
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

onMounted(async() => {
  const { data } = await get(orderId.value, `id, status, comment, created_at, returned_at, due_date, order_items(*)`);
  order.value = data;
  const orderItems = data.order_items;
  const orderBookItems = orderItems.map(item => ({id: item.book_id, status: item.status, orderItemComment: item.comment}));
  const bookIds = orderItems.map(item => (item.book_id));
  const { data: bookItemsData } = await getBooksItems({ columns: `id, book_id, books(id,title,cover_image)`, bookIds: bookIds});
  bookItems.value = orderBookItems.map(item => {
    const matchingData = bookItemsData.find(data => data.book_id === item.id);
    if (matchingData) {
      return {
        ...item,
        title: matchingData.books.title,
        coverImage: matchingData.books.cover_image,
      };
    }

    return item;
  });
console.log('BOOK ITEMS => ', bookItems.value);

});
</script>