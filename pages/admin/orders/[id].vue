<template>
  <h3 class="text-stone-900">Order's Details</h3>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleUpdate">
    <div class="flex items-center space-x-1">
      <label class="block text-sm text-gray-500">Reader:</label>
      <NuxtLink :to="`/admin/readers/${order?.readers.id}`">
        <span class="text-gray-900">{{ order?.readers.fullName }}</span>
      </NuxtLink>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
          <label for="current-status" class="text-sm font-medium text-gray-500">Status:</label>
          <span id="current-status" class="text-sm text-gray-900">{{ order ? capitalize(order?.orderStatus) : '' }}</span>
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
      <label class="block text-sm text-gray-500">Comment:</label>
      <UInput placeholder="Enter comment" v-model="itemComment"/>
    </div>
    <div class="flex justify-between gap-4">
      <button type="submit" 
        class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Update
      </button>
    </div>
  </form>
  <DataTable
    v-if="bookItems.length > 0"
    :data="bookItems"
    :columns="columns"
    detail-link="/admin/books/"
    :remove-unavailable-book="removeUnavailableBook"
    v-model="itemComment"
    :mark-lost-book="markLostBook"
  />
</template>

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ORDER_ITEM_STATUS } from '~/composables/orderItems';
import { ORDER_STATUS_OPTIONS } from '~/composables/orders';
import { BOOK_ITEM_STATUS } from '~/composables/bookItems';

const { update, get:getOrderById } = useOrders();
const { index:getBooksItems, update:updateBookItemStatus } = useBookItems();
const { upsert:upsertOrderItems, index:getOrderItems, remove:removeOrderItem, update:markDeletedAt } = useOrderItems();
const { upsert:upsertBookItems } = useBookItems();

const orderId = useRouteParams('id', null, { transform: Number });
const bookItems = ref([]);
const order = ref(null);
const itemComment = ref('');
const orderStatus = ref('');
const oldOrderStatus = ref('');

const transformBookItemStatus = {
  closed: 'opening',
  borrowing: 'borrowing',
  waiting: 'opening',
  rejected: 'rejected'
};

function getOrderSelection() {
  return ORDER_STATUS_OPTIONS.filter(option => option.id !== oldOrderStatus.value);
}

const handleUpdate = async() => {
  const updateOrderData = {
    status: orderStatus.value,
    comment: itemComment.value,
    returned_at: orderStatus.value === ORDER_STATUS.CLOSE ? new Date().toISOString() : null
  };

  const upsertBookItemsData = bookItems.value
    .filter(item => item.bookItemStatus !== BOOK_ITEM_STATUS.LOST)
    .map(item => {
      let tmpData = { id: item.bookItemId, book_id: item.bookId, status: item.bookItemStatus };
      if (orderStatus.value !== ORDER_STATUS.REJECT) {
        tmpData = {
          ...tmpData,
          status: transformBookItemStatus[orderStatus.value]
        }
      }

      return tmpData;
    });

  const upsertOrderItemsData = bookItems.value
    .filter(item => item.bookItemStatus !== BOOK_ITEM_STATUS.LOST)
    .map(item => ({
      id: item.orderItemId,
      order_id: item.orderId,
      book_id: item.bookId,
      book_item_id: item.bookItemId,
      status: orderStatus.value,
    }));

  console.log(
    `updateOrderData => `, updateOrderData,
    `upsertBookItemsData => `, upsertBookItemsData,
    `upsertOrderItemsData => `, upsertOrderItemsData
  );

  Promise.all([
    update(orderId.value, updateOrderData),
    upsertOrderItems(upsertOrderItemsData),
    upsertBookItems(upsertBookItemsData)
  ])
  .then(() => {
    loadOrder();
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

onMounted(async() => {
  await loadOrder();
});

async function loadOrder() {
  const { data } = await getOrderById(orderId.value, `id, orderStatus:status, readers(id, fullName:full_name), order_items(*)`);
  order.value = data;
  orderStatus.value = data.orderStatus;
  oldOrderStatus.value = data.orderStatus;

  const orderItems = data.order_items;
  const orderBookItems = orderItems
    .filter(item => item.deleted_at === null)
    .map(item => ({ bookId: item.book_id, orderItemStatus: item.status, orderItemId: item.id, bookItemId: item.book_item_id }));
  console.log('ORDER BOOK ITEMS => ', orderBookItems);
  
  const bookItemIds = orderItems.map(item => (item.book_id));
  const { data: bookItemsData } = await getBooksItems({
    columns: `id, book_id, bookItemStatus:status, books(id,title,cover_image)`,
    bookIds: bookItemIds
  });
  console.log('BOOK ITEMS DATA => ', bookItemsData);

  bookItems.value = orderBookItems.map(item => {
    const availableBook = bookItemsData.find(
      data => data.book_id === item.bookId && data.bookItemStatus === BOOK_STATUS.OPENING && item.bookItemId === null
    );

    if (availableBook) {
      console.log('AVAILABLE BOOK => ', availableBook);
      return {
        ...item,
        bookItemId: availableBook.id,
        bookItemStatus: availableBook.bookItemStatus,
        title: availableBook.books.title,
        coverImage: availableBook.books.cover_image,
        orderId: order.value.id,
        uId: `${item.bookId}-${availableBook.id}-${order.value.id}-${item.orderItemId}`,
        orderStatus: orderStatus.value
      };
    } else if (null === item.bookItemId) {
      const unavailableBook = bookItemsData.find(
        data => data.book_id === item.bookId && data.bookItemStatus === BOOK_STATUS.PENDING
      );
      console.log('UNAVAILABLE BOOK => ', unavailableBook);
      return {
        ...item,
        bookItemStatus: unavailableBook.bookItemStatus,
        title: unavailableBook.books.title,
        coverImage: unavailableBook.books.cover_image,
        orderId: order.value.id,
        uId: `${item.bookId}-${unavailableBook?.id}-${order.value.id}-${item.orderItemId}`,
        orderStatus: orderStatus.value
      };
    } else {
      const matchingBook = bookItemsData.find(
        data => data.book_id === item.bookId && data.id === item.bookItemId
      );
      console.log('OTHER BOOK => ', matchingBook);
      return {
        ...item,
        bookItemStatus: matchingBook.bookItemStatus,
        title: matchingBook.books.title,
        coverImage: matchingBook.books.cover_image,
        orderId: order.value.id,
        orderStatus: orderStatus.value,
        uId: `${item.bookId}-${matchingBook.id}-${order.value.id}-${item.orderItemId}`,
      };
    }
  });
  console.log('bookItems => ', bookItems.value);
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

    await loadOrder()
    useToastSuccess();
  })
  .catch((error) => useToastError(error));
}

async function removeUnavailableBook(orderItemId: number) {
  console.log('removeUnavailableBook => ', orderItemId, itemComment.value);

  await markDeletedAt(orderItemId, { deleted_at: new Date().toISOString(), comment: itemComment.value, status: ORDER_ITEM_STATUS.UNAVAILABLE})
    .then(async({ error }) => {
      if (error) throw error;

      await loadOrder()
      useToastSuccess();
      itemComment.value = '';
    })
    .catch((error) => useToastError(error));
}

const columns = [
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
]
</script>