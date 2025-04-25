<template>
  <h3 class="text-stone-900">Your book cart</h3>
  <h3 v-if="bookCart.length === 0" class="text-primary-900">Enjoy your time and choose your love books</h3>
  <DataTable
    v-if="book?.count > 0"
    :data="book?.data"
    :columns="columns"
    :handle-remove-cart-item="handleRemove"
    detail-link="/book/"
  />
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

import { ORDER_STATUS } from '~/composables/orders';

const { bookCart, removeCartItem, reset: resetBookCart } = useBookCarts();
const { index } = useBooks();
const { userId } = useAuth();
const { insert, index: getOrders } = useOrders();
const { insert:addOrderItems } = useOrderItems();

const { data: book, error, refresh } = useAsyncData(
  'book-cart',
  () => index({ ids: bookCart.value.map(id => (Number(id))) }),
  { watch: [bookCart.value] }
);

async function handleBorrow() {
  return insert({reader_id: userId.value, status: ORDER_STATUS.WAITING})
    .then(async({ error }) => {
      if (error) throw error;

      const { data: newestOrder, error:getOrdersError } = await getOrders({ readerId: userId.value, status: [ORDER_STATUS.WAITING]})
        .limit(1)
        .single();
      if (getOrdersError) throw getOrdersError;

      const orderItems = bookCart.value.map(id => ({ order_id: newestOrder.id, book_id: id, status:ORDER_STATUS.WAITING }));
      const { error:addOrderItemsError } = await addOrderItems(orderItems);
      if (addOrderItemsError) throw addOrderItemsError;

      resetBookCart();
      useToastSuccess();
      refresh();
    })
    .catch((error) => useToastError(error))
  ;
}

function handleRemove(bookId: number) {
  removeCartItem(bookId);
  refresh();
}

const columns = [
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