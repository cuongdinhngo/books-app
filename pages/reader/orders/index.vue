<template>
  <h3 class="text-stone-900">Historical Orders</h3>

  <h3 v-if="status === 'pending'" class="justify-center flex text-stone-900">Loading ...</h3>
  <div v-else>
    <UTable
      v-if="order.count > 0"
      :data="order.data"
      :columns="columns"
      class="flex-1"
    >
      <template #id-cell="{ row }">
        <NuxtLink :to="`/reader/orders/${row.original.id}`" class="hover:text-primary-700 cursor-pointer">
          #{{ row.original.id}}
        </NuxtLink>
      </template>

      <template #status-cell="{ row }">
        <NuxtLink :to="`/reader/orders/${row.original.id}`" class="hover:text-primary-700 cursor-pointer">
          {{ capitalize(row.original.status) }}
          <UBadge
            v-if="row.getValue('status') === ORDER_ITEM_STATUS.BORROWING && new Date().toDateString > row.original.due_date"
            color="warning" variant="solid"
          >
            Overdue
          </UBadge>
        </NuxtLink>
      </template>

      <template #orderItems-cell="{ row }">
        <NuxtLink :to="`/reader/orders/${row.original.id}`" class="hover:text-primary-700 cursor-pointer">
          {{ row.getValue('orderItems')[0].count }}
        </NuxtLink>
      </template>

      <template #createdAt-cell="{ row }">
        <NuxtLink :to="`/reader/orders/${row.original.id}`" class="hover:text-primary-700 cursor-pointer">
          {{ readableDateTime(row.getValue('createdAt')) }}
        </NuxtLink>
      </template>

      <template #dueDate-cell="{ row }">
        <NuxtLink :to="`/reader/orders/${row.original.id}`" class="hover:text-primary-700 cursor-pointer">
          {{ readableDateTime(row.getValue('dueDate')) }}
        </NuxtLink>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { ORDER_ITEM_STATUS } from '~/composables/orderItems';

const { index } = useOrders();
const { userId } = useAuth();

const selectColumns = `
  id,
  status,
  created_at,
  due_date,
  order_items(count)
`;
const {data: order, error, status} = await useAsyncData(
  'reader-orders',
  () => index({ columns: selectColumns, readerId: userId.value }) 
)

console.log('DATA => ', order);

const columns = [
  {
    accessorKey: 'id',
    header: 'Order No.'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'order_items',
    header: 'Quantity',
    id: 'orderItems'
  },
  {
    accessorKey: 'created_at',
    header: 'Booked at',
    id: 'createdAt'
  },
  {
    accessorKey: 'due_date',
    header: 'Due date',
    id: 'dueDate'
  }
]
</script>