<template>
  <h3 class="text-stone-900">Order list</h3>

  <h3 v-if="status === 'pending'" class="justify-center flex text-stone-900">Loading ...</h3>
  <div v-else>
    <DataTable
      v-if="order.count > 0"
      :data="order.data"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const { index } = useOrders();
const { userId } = useAuth();

const selectColumns = `
  id,
  status,
  created_at,
  order_items(count)
`;
const {data: order, error, status} = await useAsyncData(
  'reader-orders',
  () => index({ columns: selectColumns, readerId: userId.value }) 
)

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/reader/order/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        `#${row.getValue('id')}`
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/reader/order/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        capitalize(row.original.status)
      )
    }
  },
  {
    accessorKey: 'order_items',
    header: 'Quantity',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/reader/order/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        row.getValue('order_items')[0].count
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Booked at',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/reader/order/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        new Date(row.getValue('created_at')).toLocaleString(
          'en-US',
          { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        )
      )
    }
  },
]
</script>