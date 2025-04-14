<template>
  <h3 class="text-stone-900">Your book cart</h3>
  <DataTable
    v-if="books.length > 0"
    :data="books"
    :columns="columns"
  />
  <div class="flex justify-end mt-4">
      <UButton
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

const UAvatar = resolveComponent('UAvatar');
const UButton = resolveComponent('UButton')
const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/book/${row.getValue('id')}`,
          class: 'hover:text-primary-700'
        },
        `#${row.getValue('id')}`
      )
    }
  },
  {
    accessorKey: 'coverImage',
    header: 'Book',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.coverImage,
          alt: row.original.title,
          size: '2xl',
          ui: {root: 'rounded-none'}
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted) text-stone-800' }, row.original.title),
        ])
      ])
    }
  },
  {
    accessorKey: 'authors',
    header: `Authors`,
    cell: ({ row }) => `${row.getValue('authors').map(author => author.name).join(', ')}`
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      return h(
        UButton,
        {
          label: 'Remove',
          color: 'primary',
          variant: 'subtle',
          class: 'ml-auto',
          onClick: () => handleRemove(row.original.id)
        }
      )
    }
  }
]

const { bookCart, getBookCartFromStorage, storeBookCart } = useBookCarts();
const { books, getBooksByIds } = useBooks();
const { userId } = useAuth();
const { addNewOrder, error, isLoading, getNewestOrderByReader } = useOrders();
const { addOrderItems } = useOrderItems();

async function handleBorrow() {
  console.log('I want to Borrow these books -> ', userId.value);
  const orderResponse = await addNewOrder({reader_id: userId.value, status: 'waiting'});
  const insertedOrder = await getNewestOrderByReader(userId.value);
  const orderItems = bookCart.value.map(id => ({order_id: insertedOrder.id, book_item_id: id, status: 'waiting'}));
  const orderItemResponse = await addOrderItems(orderItems);
  if (orderResponse && orderResponse) {
    bookCart.value = [];
    books.value = [];
    storeBookCart();
    console.log('Order & Order Items were inserted successfully!');
  }
}

function handleRemove(bookId) {
  console.log('Remove -> ', bookId);
  bookCart.value = bookCart.value.filter(item => item !== bookId);
  books.value = books.value.filter(item => (item.id !== bookId));
  storeBookCart();
}

onMounted(async() => {
  getBookCartFromStorage();
  await getBooksByIds(bookCart.value.map(id => (Number(id))));
});
</script>