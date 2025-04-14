<template>
  <h3 class="text-stone-900">Order list</h3>

  <h3 v-if="status === 'pending'" class="justify-center flex text-stone-900">Loading ...</h3>
  <div v-else>
    <DataTable
      v-if="orders.length > 0"
      :data="orders"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => capitalize(row.getValue('status'))
  },
  {
    accessorKey: 'order_items',
    header: 'Quantity',
    cell: ({ row }) => row.getValue('order_items')[0].count
  },
]

const { getOrdersByReaderId} = useOrders();
const { userId } = useAuth();
const {data: orders, error, status} = await useAsyncData('reader-orders', () => {
  return getOrdersByReaderId(userId.value);
})

console.log('Orders => ', orders.value, 'UserId => ', userId.value);
</script>