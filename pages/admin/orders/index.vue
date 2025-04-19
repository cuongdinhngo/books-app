<template>
    <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <USelectMenu
      v-model="selectedStatus"
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

  <DataTable
    v-if="order && order.count > 0"
    :data="order?.data"
    :columns="columns"
    :handle-approve="handleApprove"
  />
  <h3 v-else class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="order?.count > 0"
    :totalCounts="order.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const { index, update } = useOrders();
const { getOrderItems, upsertOrderItems } = useOrderItems();
const { upsertBookItems } = useBookItems();

const { query } = useRoute();
const page = ref(Number(query.page) || 1);
const pageSize = 5;
const statusOptions = [
  {label: 'Done', id: 'done'},
  {label: 'Borrowing', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'}
];
const selectedStatus = ref([]);
const searchParams = ref({
  columns: `id, status, readers(id, fullName:full_name)`,
  status: selectedStatus.value,
  page: page.value,
  size: pageSize
});

const { data: order, error, refresh, clear } = useAsyncData(
  `order-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handleSearch = () => {
  searchParams.value.status = selectedStatus.value;
  refresh();
}

const handlePageChange = (newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const handleApprove = async(orderId) => {
  const { data: orderItems } = await getOrderItems(orderId);
  let orderItemsData = orderItems.map(item => ({
    id: item.id,
    status: 'borrowing',
    order_id: orderId,
    book_item_id: item.book_item_id
  }));
  let bookItemsData = orderItems.map(item => ({
    id: item.book_item_id,
    status: 'borrowed'
  }));

  Promise
    .all([
      update(orderId, {status: 'borrowing'}), 
      upsertOrderItems(orderItemsData),
      upsertBookItems(bookItemsData)
    ])
    .then(() => refresh())
    .catch((error) => useToastError(error));
}

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
    id: 'orderActions',
  }
]
</script>