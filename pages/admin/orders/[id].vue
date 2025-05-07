<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleUpdate">
    <div class="flex items-center space-x-1">
      <label class="block text-sm text-gray-500">Reader:</label>
      <NuxtLink :to="{ name: 'admin-readers-id', params: { id: order?.readers.id }}">
        <div class="flex items-center gap-3 hover:text-primary-500">
          <UAvatar :src="order?.readers.photo" size="xl" class="rounded-none"/>
          <div>
            <p class="font-medium text-stone-800 hover:text-primary-500">{{ order?.readers.fullName }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <label for="current-status" class="text-sm font-medium text-gray-500">Status:</label>
        <span id="current-status" class="text-sm text-gray-900">{{ order ? capitalize(order?.orderStatus) : '' }}</span>
        <UBadge
          v-if="new Date() > new Date(order?.orderDueDate) && order?.orderStatus === ORDER_STATUS.BORROWING"
          variant="solid" color="warning"
        >
          Overdue
        </UBadge>
      </div>
      <div class="flex items-center space-x-2">
        <label for="new-status" class="text-sm font-medium text-gray-500 whitespace-nowrap">Change to:</label>
        <USelectMenu
          v-model="orderStatus"
          :items="getOrderSelection()"
          value-key="id"
          variant="none"
          placeholder="Select order status"
          class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex items-center space-x-1">
      <label class="block text-sm text-gray-500">Booked at:</label>
      <span class="text-sm text-gray-900">{{ useDateFormat(order?.orderCreatedAt, 'MMMM Do, YYYY') }}</span>
    </div>

    <div class="flex items-center space-x-1">
      <label class="block text-sm text-gray-500">Due date:</label>
      <span class="text-sm text-gray-900">{{ order?.orderDueDate ? useDateFormat(order?.orderDueDate, 'MMMM Do, YYYY') : 'waiting for approve' }}</span>
      <UButton
        label="Extend due date"
        color="neutral"
        variant="subtle"
        @click="openDueDateModal = !openDueDateModal"
        :disabled="renewCount >= MAX_EXTEND_DUE_DATE_TIMES || order?.orderStatus !== ORDER_STATUS.BORROWING"
      />
    </div>

    <div class="flex items-center space-x-1">
      <label class="block text-sm text-gray-500">Comment:</label>
      <UInput placeholder="Enter comment" v-model="itemComment" class="w-full" variant="subtle"/>
    </div>

    <div class="flex justify-between gap-4">
      <button type="submit" 
        class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Update
      </button>
    </div>
  </form>

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

  <!-- Tabs Navigation -->
  <div class="flex border-b border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="activeTab = tab.id"
      :class="[
        'px-4 py-2 text-gray-600 font-medium border-b-2 focus:outline-none',
        activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-blue-500'
      ]"
    >
      {{ tab.name }}
    </button>
  </div>

  <!-- Tab Content -->
  <div class="mt-6">
    <div v-if="activeTab === 'details'" class="tab-content">
      <UTable
        v-if="bookItems.length > 0"
        :data="bookItems"
        class="flex-1"
        :columns="[
          {
            accessorKey: 'coverImage',
            header: 'Book',
          },
          {
            accessorKey: 'bookItemStatus',
            header: 'Status',
            id: 'bookItemStatus'
          },
          {
            header: 'Actions',
            id: 'adminOrderActions'
          }
        ]"
      >

        <template #coverImage-cell="{ row }">
          <NuxtLink :to="{ name: 'admin-books-id', params: { id: row.original.id }}">
            <div class="flex items-center gap-3">
              <UAvatar :src="row.original.coverImage" size="xl" class="rounded-none"/>
              <div>
                <p class="font-medium text-stone-800">{{ row.original.title}}</p>
              </div>
            </div>
          </NuxtLink>
        </template>

        <template #bookItemStatus-cell="{ row }">
          <div class="flex flex-col">
            <div class="flex items-center">
              <UBadge class="capitalize p-2 mr-4" variant="subtle" :color="bookItemStatusColor[row.original.orderItemStatus]">
                {{ transformOrderItemStatus(row.original) }}
              </UBadge>
              <USelectMenu
                :disabled="row.original.orderItemStatus !== ORDER_STATUS.WAITING"
                v-model="row.original.bookItemId"
                :items="getBookItemsOption(row.original.id)"
                variant="none"
                placeholder="Book item"
                class="w-45 border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mt-1">
              <span v-if="row.original.orderItemComment">Comment: 
                {{ row.original.orderItemComment }}
              </span>
            </div>
          </div>
        </template>

        <template #adminOrderActions-cell="{ row }">
          <UModal
            title="Are you sure to reject this item?"
            v-model:open="rejectModal"
            :close="{
              color: 'primary',
              variant: 'outline',
              class: 'rounded-full'
            }"
          >
            <UButton
              icon="lucide:circle-x"
              label="Reject"
              size="md"
              color="primary"
              variant="subtle"
              v-if="row.original.orderItemStatus === ORDER_ITEM_STATUS.WAITING"
            />
            <template #body>
              <div class="flex flex-col">
                <UTextarea placeholder="Type something..." class="w-full mb-5" v-model="itemComment"/>
                <UButton
                  icon="lucide:badge-check"
                  label="Submit"
                  size="md"
                  color="primary"
                  variant="subtle"
                  class="text-right"
                  @click="rejectOrderItem(row.original.orderItemId)"
                />
              </div>
            </template>
          </UModal>

          <UBadge
            v-if="[ORDER_STATUS.CLOSE, ORDER_STATUS.REJECT].includes(row.original.orderStatus) || row.original.bookItemStatus === BOOK_ITEM_STATUS.LOST"
            class="capitalize"
            variant="subtle"
            color="neutral"
          >
            Done
          </UBadge>

          <UModal
            title="Is this book lost?"
            v-model:open="lostBookModal"
            :close="{
              color: 'primary',
              variant: 'outline',
              class: 'rounded-full'
            }"
          >
            <UButton
              icon="lucide:circle-x"
              label="Lost"
              size="md"
              color="primary"
              variant="subtle"
              v-if="row.original.orderStatus === ORDER_STATUS.BORROWING && row.original.bookItemStatus === ORDER_STATUS.BORROWING"
            />
            <template #body>
              <div class="flex flex-col">
                <UTextarea placeholder="Type something..." class="w-full mb-5" v-model="itemComment"/>
                <UButton
                  icon="lucide:badge-check"
                  label="Submit"
                  size="md"
                  color="primary"
                  variant="subtle"
                  class="text-right"
                  v-if="markLostBook !== null"
                  @click="markLostBook(row.original.uId)"
                />
              </div>
            </template>
          </UModal>

        </template>
      </UTable>
    </div>

    <div v-if="activeTab === 'dueDate'" class="tab-content">
      <OrderDueDate 
        @update-renew-count="handleUpdateRenewCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ORDER_ITEM_STATUS } from '~/composables/orderItems';
import { ORDER_STATUS_OPTIONS, BORROWING_PERIOD } from '~/composables/orders';
import { BOOK_ITEM_STATUS } from '~/composables/bookItems';
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from '~/constants/notifications';
import { MAX_EXTEND_DUE_DATE_TIMES } from '~/constants/rules';

const { userId } = useAuth();
const { update, get:getOrderById } = useOrders();
const { insert:renewDueDate } = useOrderRenews();
const { upsert:upsertOrderItems, update:updateOrderItem } = useOrderItems();
const { upsert:upsertBookItems } = useBookItems();
const { insert:sendNotification } = useNotifications();

const orderId = useRouteParams('id', null, { transform: Number });
const order = ref({});
const reader = ref({});
const bookItems = ref([]);
const itemComment = ref('');
const orderStatus = ref('');
const oldOrderStatus = ref('');
const openDueDateModal = ref(false);
const orderRenewComment = ref('');
const orderRenewDueDate = ref('');
const renewCount = ref(0);
const lostBookModal = ref(false);
const rejectModal = ref(false);

const tabs = [
  { id: 'details', name: 'Details' },
  { id: 'dueDate', name: 'Extended due dates' }
];
const activeTab = ref('details');

const transformBookItemStatus = {
  closed: 'opening',
  borrowing: 'borrowing',
  waiting: 'opening',
  rejected: 'rejected'
};

function handleUpdateRenewCount(count: number) {
  renewCount.value = count;
}

function getOrderSelection() {
  return ORDER_STATUS_OPTIONS.filter(option => option.id !== oldOrderStatus.value && option.id !== ORDER_STATUS.OVERDUE && option.id !== ORDER_STATUS.WAITING);
}

const testItems = [
  { id: 1, status: 'opening' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'borrowed' },
  { id: 4, status: 'lost' },
  { id: 5, status: 'rejected' },
  { id: 6, status: 'closed' }
];

console.log('TEST ITEMS => ', testItems.filter(item => item.status !== ORDER_ITEM_STATUS.REJECT));

const selectedColumns = `
  orderStatus:status, orderId:id, orderDueDate:due_date, orderCreatedAt:created_at,
  readers!inner(id,fullName:full_name,photo),
  order_items!inner(
    orderItemId:id,
    orderItemStatus:status,
    bookItemId:book_item_id,
    orderItemComment:comment,
    books!inner(
      bookId:id, bookTitle:title, bookCoverImage:cover_image,
      book_items!inner(
        bookItemId:id, bookItemStatus:status
      )
    )
  )
`;
const { data, error, refresh } = await useAsyncData(
  `order-detail-${orderId.value}`,
  () => getOrderById(orderId.value, selectedColumns)
);

console.log('DATA => ', data.value);

order.value = data.value.data;
bookItems.value = mapBookItems(data.value.data.order_items);
orderStatus.value = data.value.data.orderStatus;
oldOrderStatus.value = data.value.data.orderStatus;
reader.value = data.value.data.readers;

console.log('BOOK ITEMS => ', bookItems.value);

async function refreshOrder() {
  await refresh();
  order.value = data.value.data;
  bookItems.value = mapBookItems(data.value.data.order_items);
  orderStatus.value = data.value.data.orderStatus;
  oldOrderStatus.value = data.value.data.orderStatus;
  console.log('Order and Book Items refreshed');
}

function getBookItemsOption(bookId) {
  return data.value.data.order_items
    .filter(item => item.books.bookId === bookId)
    .map(item => {
      const availableBookItems = item.books.book_items.filter(
        bookItem => bookItem.bookItemStatus === BOOK_ITEM_STATUS.OPENING
      );
      return availableBookItems.map(bookItem => bookItem.bookItemId)
    });
}

function mapBookItems(orderItems: Object[]) {
  return orderItems.map(item => {
    console.log('ORDER ITEM => ', item);
    let currentbookItem = {};
    if (item.orderItemStatus === ORDER_ITEM_STATUS.WAITING) {
      currentbookItem = item.books.book_items.find(
        bookItem => bookItem.bookItemStatus === BOOK_ITEM_STATUS.OPENING && item.orderItemStatus === ORDER_ITEM_STATUS.WAITING
      );
    } else {
      currentbookItem = item.books.book_items.find(
        bookItem => bookItem.bookItemId === item.bookItemId
      );
    }

    return {
      ...item,
      bookItemStatus: currentbookItem?.bookItemStatus || null,
      bookItemId: currentbookItem?.bookItemId || null,
      id: item.books.bookId,
      title: item.books.bookTitle,
      coverImage: item.books.bookCoverImage,
      orderItemId: item.orderItemId,
      orderId: orderId.value,
      orderStatus: order.value.orderStatus,
      uId: `orderId:${orderId.value}-orderItemId:${item.orderItemId}-bookId:${item.books.bookId}-bookItemId:${currentbookItem?.bookItemId}`,
    };
  });
}

async function handleRenew() {
  console.log('handleRenew => ', {
      order_id: orderId.value,
      reader_id: reader?.value.id,
      new_due_date: orderRenewDueDate.value,
      comment: orderRenewComment.value,
      approved_by: userId.value
    });
  await renewDueDate({
      order_id: orderId.value,
      reader_id: reader?.value.id,
      new_due_date: orderRenewDueDate.value,
      comment: orderRenewComment.value,
      approved_by: userId.value
    })
  .then(async({ error }) => {
    if (error) throw error;

    const {error:updateOrderError } = await update(orderId.value, { due_date: orderRenewDueDate.value });
    if (updateOrderError) throw updateOrderError;

    openDueDateModal.value = false;
    await refreshOrder();
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

const handleUpdate = async() => {
  let updateOrderData = {
    status: orderStatus.value,
    comment: itemComment.value,
    returned_at: orderStatus.value === ORDER_STATUS.CLOSE ? new Date().toISOString() : null
  };

  if (ORDER_STATUS.BORROWING === orderStatus.value) {
    const currentDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(currentDate.getDate() + (bookItems.value.length * BORROWING_PERIOD));
    updateOrderData = {
      ...updateOrderData,
      due_date: dueDate.toISOString()
    };
  }

  const upsertBookItemsData = bookItems.value
    .filter(item =>
      ![ORDER_ITEM_STATUS.LOST, ORDER_ITEM_STATUS.REJECT].includes(item.orderItemStatus)
    )
    .map(item => {
      let tmpData = { id: item.bookItemId, book_id: item.id, status: item.bookItemStatus };
      if (item.orderItemStatus !== ORDER_ITEM_STATUS.REJECT) {
        tmpData = {
          ...tmpData,
          status: transformBookItemStatus[orderStatus.value]
        }
      }

      return tmpData;
    });

  const upsertOrderItemsData = bookItems.value
    .filter(item =>
      ![ORDER_ITEM_STATUS.LOST, ORDER_ITEM_STATUS.REJECT].includes(item.orderItemStatus)
    )
    .map(item => ({
      id: item.orderItemId,
      order_id: item.orderId,
      book_id: item.id,
      book_item_id: item.bookItemId,
      status: orderStatus.value,
    }));

  Promise.all([
    update(orderId.value, updateOrderData),
    upsertOrderItems(upsertOrderItemsData),
    upsertBookItems(upsertBookItemsData)
  ])
  .then(async({error}) => {
    if (error) throw error;

    const { type, message } = getNotificationDetail(orderStatus.value);
    await sendNotification({
      reader_id: reader.value.id,
      type: type,
      message: message,
      notifiable_id: orderId.value,
      notifiable_type: 'orders',
    });
    await refreshOrder();
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

function getNotificationDetail(orderStatus) {
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

const bookItemStatusColor = {
  opening: 'success',
  pending: 'warning',
  borrowed: 'warning',
  lost: 'warning',
  rejected: 'neutral',
  closed: 'neutral',
}

function transformOrderItemStatus(data) {
  let status = '';

  if (data.orderItemStatus === ORDER_ITEM_STATUS.CLOSED) {
    status = 'Returned';
  } else {
    status = data.orderItemStatus;
  }

  console.log('transformOrderItemStatus => ', data, status);

  return status;
}

async function markLostBook(uId:string) {
  const lostItem = bookItems.value.filter(item => item.uId === uId);
  console.log('MARK LOST BOOK => ', uId, lostItem)

  Promise.all([
    useTable('order_items').update({ status: BOOK_ITEM_STATUS.LOST, comment: itemComment.value }).eq('id', lostItem[0].orderItemId),
    useTable('book_items').update({ status: BOOK_ITEM_STATUS.LOST }).eq('id', lostItem[0].bookItemId)
  ])
  .then(async({ error }) => {
    if (error) throw error;

    itemComment.value = '';
    lostBookModal.value = false;
    await refreshOrder();
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

async function rejectOrderItem(orderItemId: number) {
  await updateOrderItem(orderItemId, { comment: itemComment.value, status: ORDER_ITEM_STATUS.REJECT })
    .then(async({ error }) => {
      if (error) throw error;

      rejectModal.value = false;
      await refreshOrder();
      useToastSuccess();
      itemComment.value = '';
    })
    .catch((error) => useToastError(error));
}
</script>