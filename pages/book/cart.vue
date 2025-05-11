<template>
  <h3 class="text-stone-900">Your book cart</h3>
  <h3 v-if="bookCart.length === 0" class="text-primary-900">Enjoy your time and choose your love books</h3>
  <UTable
    v-if="bookCart.length > 0"
    ref="table"
    v-model:row-selection="rowSelection"
    :data="book?.data"
    :columns="columns"
  >
    <template #select-header="{ table }">
      <UCheckbox
        :model-value="table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()"
        v-on:update:model-value="(value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)"
      />
    </template>

    <template #select-cell="{ row }">
      <UCheckbox
        :key="row.original.id"
        :model-value="row.getIsSelected()"
        v-on:update:model-value="(value: boolean | 'indeterminate') => row.toggleSelected(!!value)"
      />
    </template>

    <template #coverImage-cell="{ row }">
      <NuxtLink :to="`/book/${row.original.id}`">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.original.coverImage" size="xl" class="rounded-none"/>
          <div>
            <p class="font-medium text-stone-800">{{ row.original.title}}</p>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #cartActions-cell="{ row }">
      <UButton
        icon="lucide:trash-2"
        size="md"
        color="warning"
        variant="subtle"
        @click="handleRemoveCartItem(Number(row.original.id))"
      >
        Remove
      </UButton>
    </template>
  </UTable>

  <div
    v-if="bookCart.length > 0"
    class="px-4 py-3.5 border-t border-accented text-sm text-muted text-stone-800"
  >
    {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
    {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
  </div>

  <div class="flex justify-end mt-4">
    <UButton
      v-if="bookCart.length > 0"
      label="Borrow"
      icon="lucide:handshake"
      color="primary"
      size="lg"
      @click="handleBorrow"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { ORDER_STATUS } from '~/constants/orders';
import { TIMELINE_TYPES } from '~/constants/orderTimeline';

const { bookCart, removeCartItem, reset: resetBookCart } = useBookCarts();
const { index } = useBooks();
const { userId } = useAuth();
const { insert, index:getOrders } = useOrders();
const { insert:createOrderTimeline } = useOrderTimeline();

const table = useTemplateRef('table');
const rowSelection = ref<Record<string, boolean>>({})
const checkoutItems = ref([]);

const { data: book, error, refresh } = useAsyncData(
  'book-cart',
  () => index({ ids: bookCart.value.map(id => (Number(id))) }),
  { watch: [bookCart.value] }
);

async function handleBorrow() {
  if (!userId.value) {
    window.alert('Please login to borrow books');
    navigateTo('/login');
    return;
  }

  checkoutItems.value = table?.value?.tableApi.getFilteredSelectedRowModel().rows.map(row => row.original.id);
  if (checkoutItems.value.length > 2) {
    window.alert('You can borrow only 2 books');
    return;
  }

  const orderItems = checkoutItems.value.map(id => ({
    reader_id: userId.value,
    book_id: id,
    status:ORDER_STATUS.WAITING,
  }));

  return insert(orderItems)
    .then(async({ error }) => {
      if (error) throw error;

      const { data:insertedOrders, error: orderError } = await getOrders({ status: [ORDER_STATUS.WAITING], readerId: userId.value });
      if (orderError) throw orderError;

      const orderTimelines = insertedOrders.map((order) => ({
        order_id: order.id,
        action: TIMELINE_TYPES.ORDER_CREATED,
        user_id: userId.value
      }));

      console.log('orderTimelines', orderTimelines);

      await createOrderTimeline(orderTimelines);

      resetBookCart(checkoutItems.value);
      useToastSuccess();
      refresh();
    })
    .catch((error) => useToastError(error))
  ;
}

function handleRemoveCartItem(bookId: number) {
  removeCartItem(bookId);
  refresh();
}

const columns = [
  {
    id: 'select'
  },
  {
    accessorKey: 'coverImage',
    header: 'Book',
    id: 'coverImage'
  },
  {
    accessorKey: 'authors',
    header: `Authors`,
    cell: ({ row }) => `${row.getValue('authors').map(author => author.name).join(', ')}`
  },
  {
    header: 'Actions',
    id: 'cartActions'
  }
]
</script>