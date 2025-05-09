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

  <div class="w-full">
    <OrderCard
      v-if="order?.count > 0"
      v-for="order in order?.data"
      :key="order.id"
      :order="order"
      :book="order.books"
      :user="order.users"
      :book-copies="order.books.book_copies"
      :order-renews="order.order_renews"
    />
  </div>
  <h3 v-if="order?.count == 0" class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="order?.count > 0"
    :totalCounts="order.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/constants/orders';
import { useRouteQuery } from '@vueuse/router';

const { index } = useOrders();
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
  columns: `
    id, status, book_id, book_copy_id, due_date, created_at,
    users!inner(id, name, photo),
    books!inner(
      id, title, cover_image,
      book_copies!inner(id, status)
    ),
    order_renews(*)
  `,
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

console.log('order', order);

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

</script>