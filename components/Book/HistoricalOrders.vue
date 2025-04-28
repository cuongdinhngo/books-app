<template>
  <div class="p-3">
    <UTable
      v-if="orderItems.length > 0"
      :data="orderItems"
      :columns="columns"
      class="flex-1"
    >
      <template #orderId-cell="{ row }">
        <NuxtLink :to="`/admin/orders/${row.original.orderId}`" class="hover:text-primary-700 cursor-pointer">
          {{ row.original.orderId }}
        </NuxtLink>
      </template>

      <template #orderItemStatus-cell="{ row }">
        <UBadge class="capitalize" variant="subtle" :color="orderItemStatusColor[row.original.orderItemStatus]">
          {{ row.original.orderItemStatus }}
        </UBadge>
      </template>

      <template #orderCreatedAt-cell="{ row }">
        <NuxtLink :to="`/admin/orders/${row.original.orderId}`" class="hover:text-primary-700 cursor-pointer">
          {{ row.original.orderCreatedAt }}
        </NuxtLink>
      </template>

      <template #orderReturnedAt-cell="{ row }">
        <NuxtLink :to="`/admin/orders/${row.original.orderId}`" class="hover:text-primary-700 cursor-pointer">
          {{ row.original.orderReturnedAt }}
        </NuxtLink>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
const { index:getOrderItems} = useOrderItems();

const orderItems = ref([]);
const bookId = useRouteParams('id', null, { transform: Number });
const orderItemStatusColor = {
  openning: 'success',
  pending: 'info',
  borrowed: 'warning',
  lost: 'neutral',
  closed: 'neutral',
  rejected: 'neutral',
}

const columns = [
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
];

const { data, error, refresh } = await useAsyncData(
  `book-historical-orders-${bookId.value}`,
  () => getOrderItems({ columns: 'orderId:order_id, orderItemStatus:status, orderItemComment:comment, orders(*)', bookId:bookId.value }),
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