<template>
  <h3 class="text-stone-900">Order's Details</h3>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleUpdate">
    <div class="flex items-center space-x-1">
      <label class="block text-sm font-medium text-gray-400">Reader:</label>
      <span class="text-gray-900">{{ order?.readers.fullName }}</span>
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
  />
</template>

<script setup>
const { order, getOrderById, updateOrderStatus } = useOrders();
const { getBookInfoByItemIds } = useBookItems();
const { orderItems, updateOrderItems, getOrderItemsByOrderId } = useOrderItems();
const { updateBulk } = useBookItems();

const route = useRoute();
const orderId = Number(route.params.id);
const bookItems = ref([]);

const orderStatus = ref('');
const statusOptions = ref([
  {label: 'Done', id: 'done'},
  {label: 'Borrowing', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'}
]);

const UBadge = resolveComponent('UBadge');
const UAvatar = resolveComponent('UAvatar');
const columns = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'coverImage',
    header: 'Book',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.coverImage,
          alt: row.original.title,
          size: '2xl',
          ui: {root: 'rounded-none'}
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted) text-stone-800' }, row.original.title),
        ])
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        open: 'success',
        pending: 'info',
        borrowed: 'warning',
        lost: 'neutral'
      }[row.getValue('status')]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  }
]

const transformBookItemStatus = {
  done: 'open',
  borrowing: 'borrowed',
  waiting: 'open',
};

const handleUpdate = async() => {
  await updateOrderStatus(orderId, {status: orderStatus.value});
  await getOrderItemsByOrderId(orderId);
  let orderItemsData = orderItems.value.map(item => ({id: item.id, status: orderStatus.value, order_id: orderId, book_item_id: item.book_item_id}));
  await updateOrderItems(orderItemsData);
  let bookItemsData = orderItems.value.map(item => ({id: item.book_item_id, status: transformBookItemStatus[orderStatus.value]}));
  await updateBulk(bookItemsData);
  await loadOrder();
}

onMounted(async() => {
  await loadOrder();
});

async function loadOrder() {
  await getOrderById(orderId);
  const orderItems = order?.value.order_items;
  orderStatus.value = order?.value.status;
  const orderBookItems = orderItems.map(item => ({id: item.book_item_id, status: item.status}));
  const bookItemData = await getBookInfoByItemIds(orderItems.map(item => (item.book_item_id)))
  bookItems.value = orderBookItems.map(item => {
    const matchingData = bookItemData.find(data => data.bookItemId === item.id);
    if (matchingData) {
      return {
        ...item,
        title: matchingData.books.title,
        coverImage: matchingData.books.cover_image,
      };
    }

    return item;
  });
}
</script>