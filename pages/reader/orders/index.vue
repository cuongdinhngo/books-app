<template>
  <h3 class="text-stone-900">Historical Orders</h3>

  <div class="w-full">
    <ReaderOrderCard
      v-if="order?.count > 0"
      v-for="order in order?.data"
      :key="order.id"
      :order="order"
      :book="order.books"
      :user="order.users"
      :book-copies="order.books.book_copies"
    />
  </div>
  <h3 v-if="order?.count == 0" class="justify-center flex text-stone-900">No Data</h3>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { ORDER_ITEM_STATUS } from '~/composables/orderItems';
import { useRouteQuery  } from '@vueuse/router'; 

const { index } = useOrders();
const { userId } = useAuth();

const page = useRouteQuery('page', 1, { transform: Number });
const pageSize = 10;
const orderId = useRouteQuery('id', null);
const searchParams = ref({
  columns: `
    id, status, book_id, book_copy_id, due_date, created_at,
    users!inner(id, name, photo),
    books!inner(
      id, title, cover_image,
      book_copies!inner(id, status)
    )
  `,
  readerId: userId.value,
  id: orderId.value,
  page: page.value,
  size: pageSize
});

const { data: order, error, refresh, clear } = useAsyncData(
  `order-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

console.log('Historical Orders => ', order);
</script>