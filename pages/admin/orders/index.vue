<template>
    <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <USelectMenu
      v-model="orderStatus"
      :items="statusOptions"
      value-key="id"
      multiple
      variant="none"
      placeholder="Select order status"
      class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
    </div>
  </form>

  <div v-if="isLoading" class="text-center text-stone-950">Loading books ...</div>

  <DataTable
    v-if="orders && orders.length > 0"
    :data="orders"
    :columns="columns"
  />
  <h3 v-else class="justify-center flex text-stone-900">No Data</h3>
</template>

<script setup>
const {
  orders,
  getAllOrders,
  isLoading,
  updateOrderStatus
} = useOrders();
const {
  orderItems,
  updateOrderItems,
  getOrderItemsByOrderId
} = useOrderItems();
const { updateBulk } = useBookItems();

const orderStatus = ref('');
const statusOptions = ref([
  {label: 'Done', id: 'done'},
  {label: 'Borrowing', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'}
]);

const UButton = resolveComponent('UButton')
const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'readers',
    header: `Reader`,
    cell: ({ row }) => `${row.getValue('readers').fullName}`
  },
  {
    accessorKey: 'status',
    header: `Status`,
    cell: ({ row }) => `${row.getValue('status')}`
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-1' }, [
        h(
          UButton,
          {
            label: 'Detail',
            color: 'primary',
            variant: 'subtle',
            class: 'ml-auto',
            onClick: () => navigateTo(`/admin/orders/${row.original.id}`)
          }
        ),
        h(
          UButton,
          {
            label: 'Approve',
            color: 'primary',
            variant: 'subtle',
            class: 'ml-auto',
            onClick: () => handleApprove(Number(row.original.id))
          }
        )
      ])
    }
  }
]

const handleSearch = async() => {
  await getAllOrders(orderStatus.value);
}

const handleApprove = async(orderId) => {
  await updateOrderStatus(orderId, {status: 'borrowing'});
  await getOrderItemsByOrderId(orderId);
  let orderItemsData = orderItems.value.map(item => ({id: item.id, status: 'borrowing', order_id: orderId, book_item_id: item.book_item_id}));
  await updateOrderItems(orderItemsData);
  let bookItemsData = orderItems.value.map(item => ({id: item.book_item_id, status: 'borrowed'}));
  await updateBulk(bookItemsData);
  await getAllOrders(orderStatus.value);
}

onMounted(async() => {
  await getAllOrders();
});
</script>