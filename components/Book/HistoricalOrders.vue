<template>
  <div class="p-3">
    <UTable
      v-if="orderItems.length > 0"
      :data="orderItems"
      class="flex-1"
      :columns="[
        {
          accessorKey: 'orderId',
          header: 'Order No.',
          id: 'orderId'
        },
        {
          accessorKey: 'orderItemStatus',
          header: 'Status',
        },
        {
          accessorKey: 'orderCreatedAt',
          header: 'Ordered at',
          id: 'orderCreatedAt'
        },
        {
          accessorKey: 'orderReturnedAt',
          header: 'Returned at',
          id: 'orderReturnedAt',
        },
        {
          accessorKey: 'orderItemComment',
          header: 'Comment',
          id: 'orderItemComment'
        }
      ]"
    >
      <template #orderId-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.orderId }}" class="hover:text-primary-700 cursor-pointer">
          {{ row.original.orderId }}
        </NuxtLink>
      </template>

      <template #orderItemStatus-cell="{ row }">
        <UBadge class="capitalize" variant="subtle" :color="orderItemStatusColor[row.original.orderItemStatus]">
          {{ row.original.orderItemStatus }}
        </UBadge>
      </template>

      <template #orderCreatedAt-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.orderId }}" class="hover:text-primary-700 cursor-pointer">
          {{ useDateFormat(row.original.orderCreatedAt, 'MMMM Do, YYYY') }}
        </NuxtLink>
      </template>

      <template #orderReturnedAt-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.orderId }}" class="hover:text-primary-700 cursor-pointer">
          {{ row.original.orderReturnedAt ? useDateFormat(row.original.orderReturnedAt, 'MMMM Do, YYYY') : 'Not returned' }}
        </NuxtLink>
      </template>
    </UTable>

    <Pagination
      v-model="page"
      v-if="data.count > 0"
      :totalCounts="data.count"
      :items-per-page="pageSize"
      @changePage="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';
const { index:getOrderItems} = useOrderItems();

const orderItems = ref([]);
const bookId = useRouteParams('id', null, { transform: Number });
const page = ref(useRouteQuery('page', 1, { transform: Number }));
const pageSize = 10;
const searchParams = ref({
  bookId: bookId.value,
  page: page.value,
  pageSize: pageSize,
});
const orderItemStatusColor = {
  openning: 'success',
  pending: 'info',
  borrowed: 'warning',
  lost: 'neutral',
  closed: 'neutral',
  rejected: 'neutral',
}

function handlePageChange(newPage) {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const { data, error, refresh } = await useAsyncData(
  `book/${bookId.value}/orders`,
  () => getOrderItems({
    columns: 'orderId:order_id, orderItemStatus:status, orderItemComment:comment, orders(*)',
    ...searchParams.value
  }),
  {
    watch: [searchParams.value]
  }
);

orderItems.value = data.value.data.map(item => {
  return {
    orderId: item.orderId,
    orderItemComment: item.orderItemComment,
    orderItemStatus: item.orderItemStatus,
    orderCreatedAt: item.orders.created_at,
    orderReturnedAt: item.orders.returned_at
  }
});
</script>