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
        <UInput type="date" v-model="from" variant="subtle" class="w-full"/>
      </div>
      <div class="flex-1">
        <label for="to-date" class="block text-sm font-medium text-gray-700">To Date</label>
        <UInput type="date" v-model="to" variant="subtle" class="w-full"/>
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

  <!-- ORDER DATATABLE -->
  <UTable
    v-if="order && order.count > 0"
    :data="order?.data"
    :columns="columns"
    class="flex-1"
  >
    <template #id-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.id }}" class="hover:text-primary-500">
        #{{ row.getValue('id') }}
      </NuxtLink>
    </template>

    <template #readers-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-readers-id', params: { id: row.getValue('readers').id} }">
        <div class="flex items-center gap-3 hover:text-primary-500">
          <UAvatar :src="row.getValue('readers').photo" size="xl" class="rounded-none"/>
          <div>
            <p class="font-medium text-stone-800 hover:text-primary-500">{{ capitalize(row.getValue('readers').fullName) }}</p>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #status-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.getValue('id') } }" class="hover:text-primary-500">
        {{ capitalize(row.getValue('status')) }}
        <UBadge
          v-if="new Date() > new Date(row.original.due_date) && row.original.status === ORDER_STATUS.BORROWING"
          variant="solid" color="warning"
        >
          Overdue
        </UBadge>
      </NuxtLink>
    </template>

    <template #createdAt-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.getValue('id') } }" class="hover:text-primary-500">
        {{ useDateFormat(row.original.created_at, 'MMMM Do, YYYY') }}
      </NuxtLink>
    </template>

    <template #dueDate-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.getValue('id') } }" class="hover:text-primary-500">
        {{ useDateFormat(row.original.due_date, 'MMMM Do, YYYY') }}
      </NuxtLink>
    </template>

    <template #orderActions-cell="{ row }">
      <div class="flex space-x-4">
        <UButton
          icon="lucide:calendar-cog"
          size="md"
          color="primary"
          variant="subtle"
          :to="{ name: 'admin-orders-id', params: { id: row.getValue('id') } }"
        >
          View details
        </UButton>
      </div>
    </template>
  </UTable>
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
const router = useRouter();

const page = useRouteQuery('page', 1 , { transform: Number });
const pageSize = 5;
const orderId = ref(null)
const from = ref(null);
const to = ref(null);

const selectedStatus = ref<string[]>([]);
const currentQuery = useRouteQuery('status', null).value;
if (currentQuery) {
  selectedStatus.value = Array.isArray(currentQuery) ? currentQuery : [currentQuery];
} else {
  selectedStatus.value = [ORDER_STATUS.WAITING, ORDER_STATUS.BORROWING];
}

const searchParams = ref({
  columns: `id, status, due_date, created_at, readers(id, fullName:full_name, photo)`,
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
  router.replace({
    name: 'admin-orders',
    query: { id: orderId.value, status: selectedStatus.value, from: from.value, to: to.value }
  });
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
  },
  {
    accessorKey: 'readers',
    header: `Reader`,
  },
  {
    accessorKey: 'status',
    header: `Status`,
  },
  {
    accessorKey: 'created_at',
    header: `Booked at`,
    id: 'createdAt'
  },
  {
    accessorKey: 'due_date',
    header: `Due date`,
    id: 'dueDate'
  },
  {
    header: 'Actions',
    id: 'orderActions',
  }
]
</script>