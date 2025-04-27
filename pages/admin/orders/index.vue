<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <FormInputDiv
      v-model="orderId"
      label-name="Order No"
      placeholder="Enter Order's No"
    />

    <div class="flex space-x-40">
      <div class="flex-1">
        <label for="from-date" class="block text-sm font-medium text-gray-700">From Date</label>
        <UInput type="date" v-model="from"/>
      </div>
      <div class="flex-1">
        <label for="to-date" class="block text-sm font-medium text-gray-700">To Date</label>
        <UInput type="date" v-model="to"/>
      </div>
    </div>

    <USelectMenu
      v-model="selectedStatus"
      :items="ORDER_STATUS_OPTIONS"
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

<script setup lang="ts">
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/composables/orders';
import { useRouteQuery } from '@vueuse/router';

const { index, update } = useOrders();
const { index:getOrderItems, upsert:upsertOrderItems } = useOrderItems();
const { upsert:upsertBookItems } = useBookItems();

const page = useRouteQuery('page', 1 , { transform: Number });
const pageSize = 5;

const orderId = ref(null)
const selectedStatus = ref([ORDER_STATUS.WAITING]);
const from = ref(null);
const to = ref(null);
const searchParams = ref({
  columns: `id, status, readers(id, fullName:full_name)`,
  status: selectedStatus.value,
  from: from.value,
  to: to.value,
  id: orderId.value,
  page: page.value,
  size: pageSize
});

const { data: order, error, refresh, clear } = useAsyncData(
  `order-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handleSearch = () => {
  searchParams.value.id = orderId.value;
  searchParams.value.status = selectedStatus.value;
  searchParams.value.from = from.value;
  searchParams.value.to = to.value;
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
    header: 'Order No.',
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