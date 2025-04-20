<template>
  <h3 class="text-stone-900">Your book cart</h3>
  <h3 v-if="bookCart.length === 0" class="text-primary-900">Please enjoy your time and choose your love books</h3>
  <DataTable
    v-if="book.count > 0"
    :data="book.data"
    :columns="columns"
    :handle-remove-cart-item="handleRemove"
  />
  <div class="flex justify-end mt-4">
    <UButton
      v-if="bookCart.length > 0"
      label="Borrow"
      icon="i-heroicons-hand-raised"
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

const { bookCart, removeCartItem, reset: resetBookCart } = useBookCarts();
const { index } = useBooks();
const { userId } = useAuth();
const { insert, index: getOrders } = useOrders();
const { upsert:upsertOrderItems, insert:addOrderItems } = useOrderItems();

const { data: book, error, refresh } = useAsyncData(
  'book-cart',
  () => index({ ids: bookCart.value.map(id => (Number(id))) }),
  { watch: [bookCart.value] }
);

console.log('DATA => ', book.value);
console.log('ERROR => ', error.value)

async function handleBorrow() {
  return insert({reader_id: userId.value, status: 'waiting'})
    .then(async() => {
      const { data: newestOrder } = await getOrders({ readerId: userId.value, status: ['waiting']}).limit(1).single();
      console.log('newestOrder =< ', newestOrder);
      const orderItems = bookCart.value.map(id => ({ order_id: newestOrder.id, book_item_id: id, status: 'waiting' }));
      const { error } = await addOrderItems(orderItems);
      if (error) throw error;

      resetBookCart();
      useToastSuccess();
      refresh();
    })
    .catch((error) => useToastError(error))
  ;
}

function handleRemove(bookId: number) {
  console.log('Remove -> ', bookId);
  removeCartItem(bookId);
  refresh();
}

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/book/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        `#${row.getValue('id')}`
      )
    }
  },
  {
    accessorKey: 'coverImage',
    header: 'Book',
    id: 'coverImage'
  },
  {
    accessorKey: 'authors',
    header: `Authors`,
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/book/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        `${row.getValue('authors').map(author => author.name).join(', ')}`
      )
    }
  },
  {
    header: 'Actions',
    id: 'cartActions'
  }
]
</script>