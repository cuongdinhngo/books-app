<template>
  <h3 class="text-stone-900">Order's Details</h3>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleUpdate">
    <div class="flex items-center space-x-1">
      <label class="block text-sm font-medium text-gray-400">Reader:</label>
      <NuxtLink :to="`/admin/readers/${order?.readers.id}`">
        <span class="text-gray-900">{{ order?.readers.fullName }}</span>
      </NuxtLink>
    </div>
    <div class="flex items-center space-x-1">
      <label class="block text-sm font-medium text-gray-400">Status:</label>
      <USelectMenu
        v-model="orderStatus"
        :items="statusOptions"
        value-key="id"
        variant="none"
        placeholder="Select order status"
        class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
    v-model="deletedItemComment"
  />
</template>

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
import { ORDER_ITEM_STATUS } from '~/composables/orderItems'

const { update, get:getOrderById } = useOrders();
const { index:getBooksItems, update:updateBookItemStatus } = useBookItems();
const { upsert:upsertOrderItems, index:getOrderItems, remove:removeOrderItem, update:markDeletedAt } = useOrderItems();
const { upsert:upsertBookItems } = useBookItems();

const orderId = useRouteParams('id', null, { transform: Number });
const bookItems = ref([]);
const order = ref(null);
const deletedItemComment = ref('It is not available');

const orderStatus = ref('');
const statusOptions = ref([
  {label: 'Done', id: 'done'},
  {label: 'Borrowing', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'}
]);

const transformBookItemStatus = {
  done: 'opening',
  borrowing: 'borrowing',
  waiting: 'opening',
};

const handleUpdate = async() => {
  const newStatus = transformBookItemStatus[orderStatus.value];
  const { data: orderItems } = await getOrderItems({orderId: orderId.value, isNotDeleted: true });
  const bookItemIds = orderItems?.map(item => item.book_item_id);
  let bookItemsData = [];
  let combinedOrderItems = [];
  if (bookItemIds?.length < 1) {
    const bookIds = orderItems?.map(item => item.book_id);
    const { data: bookItems} = await getBooksItems({ bookIds: bookIds, status: [BOOK_STATUS.OPENING] });
    combinedOrderItems = orderItems.map(orderItem => {
      const matchingData = bookItems?.find(item => item.book_id === orderItem.book_id);
      if (matchingData) {
        return {
          id: orderItem.id,
          book_id: orderItem.book_id,
          status: newStatus,
          order_id: orderId.value,
          book_item_id: matchingData.id
        };
      }

      return orderItem;
    });

    bookItemsData = orderItems.map(orderItem => {
      const matchingData = bookItems?.find(item => item.book_id === orderItem.book_id);
      if (matchingData) {
        return {
          id: matchingData.id,
          status: newStatus
        };
      }

      return orderItem;
    });
  } else {
    combinedOrderItems = orderItems.map(item => ({
      id: item.id,
      book_id: item.book_id,
      status: newStatus,
      order_id: orderId.value,
      book_item_id: item.book_item_id
    }));
    bookItemsData = orderItems.map(item => ({id: item.book_item_id, status: newStatus}));
  }

  const { error:upsertOrderItemsError } = await upsertOrderItems(combinedOrderItems);
  const { error:updateError } = await update(orderId.value, {status: orderStatus.value});
  const { error:upsertBookItemsError } = await upsertBookItems(bookItemsData);
  console.log(
    'upsertOrderItemsError', upsertOrderItemsError,
    'updateError', updateError,
    'upsertBookItemsError', upsertBookItemsError
  );

  // Promise.all([
  //   upsertOrderItems(combinedOrderItems),
  //   update(orderId.value, {status: orderStatus.value}),
  //   upsertBookItems(bookItemsData)
  // ])
  // .then(() => {
  //   loadOrder();
  //   useToastSuccess();
  // })
  // .catch((error) => useToastError(error));
}

onMounted(async() => {
  await loadOrder();
});

async function loadOrder() {
  const { data } = await getOrderById(orderId.value, `id, orderStatus:status, readers(id, fullName:full_name), order_items(*)`);
  order.value = data;
  console.log('ORDER DATA => ', order.value);
  const orderItems = data.order_items;
  console.log('ORDER ITEMS => ', orderItems);
  orderStatus.value = data.orderStatus;
  const orderBookItems = orderItems
    .filter(item => item.deleted_at === null)
    .map(item => ({ bookId: item.book_id, orderItemStatus: item.status, orderItemId: item.id, bookItemId: item.book_item_id }));
  const bookItemIds = orderItems.map(item => (item.book_id));

  console.log('ORDER BOOK ITEMS => ', orderBookItems);
  const { data: bookItemsData } = await getBooksItems({
    columns: `id, book_id, bookItemStatus:status, books(id,title,cover_image)`,
    bookIds: bookItemIds
  });

  console.log('bookItemsData => ', bookItemsData);
  bookItems.value = orderBookItems.map(item => {
    const availableBook = bookItemsData.find(data => data.book_id === item.bookId && data.bookItemStatus === BOOK_STATUS.OPENING);
    
    if (availableBook) {
      console.log('AVAILABLE BOOK => ', availableBook);
      return {
        ...item,
        bookItemStatus: availableBook.bookItemStatus,
        title: availableBook.books.title,
        coverImage: availableBook.books.cover_image,
      };
    } else if (null === item.bookItemId) {
      const unavailableBook = bookItemsData.find(data => data.book_id === item.bookId && data.bookItemStatus === BOOK_STATUS.PENDING);
      console.log('UNAVAILABLE BOOK => ', unavailableBook);
      return {
        ...item,
        bookItemStatus: unavailableBook.bookItemStatus,
        title: unavailableBook.books.title,
        coverImage: unavailableBook.books.cover_image,
      };
    } else {
      const matchingBook = bookItemsData.find(data => data.book_id === item.bookId && data.id === item.bookItemId);
      return {
        ...item,
        bookItemStatus: matchingBook.bookItemStatus,
        title: matchingBook.books.title,
        coverImage: matchingBook.books.cover_image,
      };
    }
  });
  console.log('bookItems => ', bookItems.value);
}

async function removeUnavailableBook(orderItemId: number) {
  console.log('removeUnavailableBook => ', orderItemId, deletedItemComment.value);

  await markDeletedAt(orderItemId, { deleted_at: new Date().toISOString(), comment: deletedItemComment.value, status: ORDER_ITEM_STATUS.UNAVAILABLE})
    .then(async({ error }) => {
      if (error) throw error;

      await loadOrder()
      useToastSuccess();
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