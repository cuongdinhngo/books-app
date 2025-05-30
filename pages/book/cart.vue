<template>
  <div class="flex flex-col min-h-[calc(100vh-120px)]">
  <h3 class="text-stone-900 font-bold text-xl">Your book cart</h3>
  <div v-if="bookCart.length === 0" class="text-center flex flex-col items-center justify-center">
    <img :src="publicAsset('img/cart.png')" class="w-[100px] h-[100px]"/>
    <h3 class="text-primary-900">Your cart has no books. Enjoy your time and choose your love books</h3>
  </div>
  <UTable
    v-if="status === 'success' && bookCart.length > 0"
    ref="table"
    v-model:row-selection="rowSelection"
    :data="data.books?.data"
    :columns="[
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
    ]"
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
      <div class="flex items-center gap-2">
        <UButton
          icon="lucide:trash-2"
          size="md"
          color="warning"
          variant="subtle"
          @click="handleRemoveCartItem(Number(row.original.id))"
        >
          Remove
        </UButton>

        <UButton
          icon="lucide:book-heart"
          size="md"
          color="primary"
          variant="subtle"
          @click="handleWishlist(Number(row.original.id))"
        >
          Add to Wishlist
        </UButton>
      </div>
    </template>
  </UTable>

  <div
    v-if="status === 'success' && bookCart.length > 0"
    class="px-4 py-3.5 border-t border-accented text-sm text-muted text-stone-800"
  >
    {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
    {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
  </div>

  <div class="flex justify-end mt-4">
    <UButton
      v-if="status === 'success' && bookCart.length > 0"
      label="Borrow"
      icon="lucide:handshake"
      color="primary"
      size="lg"
      :disabled="loading"
      @click="handleBorrow"
    />
  </div>

  <LoadingProcess
    v-if="status === 'pending'"
  />

  <!-- Suggest books on categories by Explore Category -->
  <ExploreCategory />

  <!-- Suggest top borrowed book based on historical visits -->
  <ExploreHistoricalVisit
    history-key="categories"
    :limit="20"
  />

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from '~/constants/notifications';
import { ORDER_STATUS } from '~/constants/orders';
import { TIMELINE_TYPES } from '~/constants/orderTimeline';

const { bookCart, removeCartItem, reset: resetBookCart } = useBookCarts();
const { index:getBooks } = useBooks();
const { userId } = useAuth();
const { insert, index:getOrders } = useOrders();
const { insert:createOrderTimeline } = useOrderTimeline();
const { insert:sendNotification } = useNotifications();
const { wishlists, loadWishlists, addBookToWishlist } = useWishlistActions();
const { loading, submit } = useSubmit();

const table = useTemplateRef('table');
const rowSelection = ref<Record<string, boolean>>({})
const checkoutItems = ref([]);

const { data, error, refresh, status } = useAsyncData(
  `reader/${userId.value}/book-cart`,
  async() => {
    const [books, orders] = await Promise.all([
      getBooks({ ids: bookCart.value.map(id => (Number(id))) }),
      getOrders({ status: [ORDER_STATUS.WAITING, ORDER_STATUS.BORROWING], readerId: userId.value })
    ]);

    if (userId.value) {
      await loadWishlists();
    }
    
    return { books, orders };
  }
);

const isBorrowable = computed(() => {
  return data.value?.orders?.count < 2;
});

async function handleBorrow() {
  if (!userId.value) {
    window.alert('Please login to borrow books');
    navigateTo('/login');
    return;
  }

  if (!isBorrowable.value) {
    window.alert('You already borrowed 2 books. Please return one of them before borrowing another.');
    return;
  }

  checkoutItems.value = table?.value?.tableApi.getFilteredSelectedRowModel().rows.map(row => row.original.id);
  if (checkoutItems.value.length > 2) {
    window.alert('You can borrow only 2 books');
    return;
  }

  if (checkoutItems.value.length === 0) {
    window.alert('Please select at least one book to borrow');
    return;
  }

  const currentDatetime = new Date().toISOString();
  const orderItems = checkoutItems.value.map(id => ({
    reader_id: userId.value,
    book_id: id,
    status:ORDER_STATUS.WAITING,
    created_at: currentDatetime,
  }));

  submit(() => insert(orderItems))
    .then(async() => {
      useToastSuccess('Your order has been created successfully. Please wait for the librarian to approve your order.');
      resetBookCart(checkoutItems.value);

      const { data:insertedOrders, error: orderError } = await getOrders({
        status: [ORDER_STATUS.WAITING],
        readerId: userId.value,
        createdAt: currentDatetime
      });
      if (orderError) throw orderError;

      const orderTimelines = insertedOrders.map(order => ({
        order_id: order.id,
        action: TIMELINE_TYPES.ORDER_CREATED,
        user_id: userId.value
      }));

      const notificationItems = insertedOrders.map(order => ({
        type: NOTIFICATION_TYPES.NEW_ORDER,
        notifiable_id: order.id,
        notifiable_type: 'orders',
        message: NOTIFICATION_MESSAGES.NEW_ORDER
      }));

      await createOrderTimeline(orderTimelines);
      await sendNotification(notificationItems);

      refresh();
    })
    .catch((error) => useToastError(error, 'Something went wrong. Please try again later.'));
}

function handleRemoveCartItem(bookId: number) {
  removeCartItem(bookId);
  refresh();
}

async function handleWishlist(bookId: number) {
  await addBookToWishlist(bookId);
}
</script>