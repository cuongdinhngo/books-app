<template>
  <h3 class="text-stone-900">Historical Orders</h3>

  <OrderStats
    v-if="status === 'success'"
    :orders="data.allOrders"
    :route-name="'reader-orders'"
    :reader-id="userId"
  />
  <LoadingCard
    v-if="status === 'pending'"
    :quantity="1"
    :class-value="`w-full h-10`"
  />

  <div class="w-full">
    <ReaderOrderCard
      v-if="status === 'success'"
      v-for="order in sortedOrders"
      :key="order.id"
      :order="order"
      :book="order.books"
      :user="order.users"
      :book-copies="order.books.book_copies"
      :order-renews="order.order_renews"
      :timeline="order.order_timeline"
    />
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="5"
      :class-value="`w-full h-[300px] my-5`"
    />
  </div>
  <h3 v-if="status === 'success' && data.filteredCount == 0" class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="status === 'success' && data.filteredCount > 0"
    :totalCounts="data.filteredCount"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useRouteQuery  } from '@vueuse/router'; 
import { ORDER_STATUS } from '~/constants/orders';

const { index:getOrders } = useOrders();
const { userId } = useAuth();

const page = useRouteQuery('page', 1, { transform: Number });
const pageSize = 10;
const orderId = useRouteQuery('id', null);
const statusQuery = useRouteQuery('status', null).value;
const selectedStatus = ref<string[]>([]);
if (statusQuery) {
  selectedStatus.value = Array.isArray(statusQuery) ? statusQuery : [statusQuery];
} else {
  selectedStatus.value = [];
}

const searchParams = ref({
  columns: `
    id, status, book_id, book_copy_id, due_date, created_at,
    users!inner(id, name, photo),
    books!inner(
      id, title, cover_image,
      book_copies!inner(id, status)
    ),
    order_renews(*),
    order_timeline(*)
  `,
  readerId: userId.value,
  id: orderId.value,
  status: selectedStatus.value,
  page: page.value,
  size: pageSize
});

const { data, error, refresh, status } = useAsyncData(
  `reader/${userId.value}/historical-order-${JSON.stringify(useRoute().query)}`,
  async() => {
    const [allOrders, filteredOrders] = await Promise.all([
      getOrders({ readerId: userId.value }),
      getOrders(searchParams.value),
    ]);

    return {
      allOrders: allOrders.data,
      filteredOrders: filteredOrders.data,
      filteredCount: filteredOrders.count,
    };
  },
  { watch: [searchParams.value] }
);

console.log('DATA => ', data);

const sortedOrders = computed(() => {
  if (!data.value.filteredOrders) return [];
  
  return [...data.value.filteredOrders].sort((a, b) => {
    if (a.status === ORDER_STATUS.WAITING && b.status !== ORDER_STATUS.WAITING) return -1;
    if (b.status === ORDER_STATUS.WAITING && a.status !== ORDER_STATUS.WAITING) return 1;
    if (a.status === ORDER_STATUS.BORROWING && b.status !== ORDER_STATUS.BORROWING && b.status !== ORDER_STATUS.WAITING) return -1;
    if (b.status === ORDER_STATUS.BORROWING && a.status !== ORDER_STATUS.BORROWING && a.status !== ORDER_STATUS.WAITING) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

const handlePageChange = (newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

watch(
  () => useRoute().query,
  (newQuery) => {
    console.log('newQuery => ', newQuery);
    if (newQuery.status) {
      selectedStatus.value = Array.isArray(newQuery.status) ? newQuery.status : [newQuery.status];
      searchParams.value.status = selectedStatus.value;
    }
    if (newQuery.page) {
      page.value = Number(newQuery.page);
    }
    if (newQuery.id) {
      searchParams.value.id = newQuery.id;
    }
    if (newQuery.readerId) {
      searchParams.value.readerId = newQuery.readerId;
    }
  }
);
</script>