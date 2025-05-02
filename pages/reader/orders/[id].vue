<template>
  <!-- Information Block -->
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Borrowing Information</h3>
    <div class="space-y-2">
        <p class="text-gray-600">
          Status: <span class="font-semibold"> {{ order?.status }}</span>
          <UBadge
            v-if="order?.status === ORDER_ITEM_STATUS.BORROWING && new Date().toDateString > order?.due_date"
            color="warning" variant="solid"
            class="ml-4"
          >
            Overdue
          </UBadge>
        </p>
        <p class="text-gray-600" v-if="order?.comment">Reason: <span class="font-semibold"> {{ order?.comment }}</span></p>
        <p class="text-gray-600">Quantity: <span class="font-semibold"> {{ order?.order_items.length }}</span></p>
        <p class="text-gray-600">Booked at: <span class="font-semibold">
          {{ order?.created_at ? readableDateTime(order?.created_at) : ''}}
        </span></p>
        <p v-if="order?.due_date" class="text-gray-600">Due date: <span class="font-semibold">
          {{ readableDateTime(order?.due_date) }}
        </span></p>
        <p v-if="order?.returned_at" class="text-gray-600">Returned at: <span class="font-semibold">
          {{ readableDateTime(order?.returned_at) }}
        </span></p>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <BookCard
      v-for="book in bookItems"
      :key="book.id"
      :book="book"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { useRouteParams } from '@vueuse/router';

const orderId = useRouteParams('id');
const { get } = useOrders();
const { index:getBooksItems } = useBookItems();
const order = ref(null);
const bookItems = ref(null);

onMounted(async() => {
  const { data } = await get(orderId.value, `id, status, comment, created_at, returned_at, due_date, order_items(*)`);
  order.value = data;
  const orderItems = data.order_items;
  const orderBookItems = orderItems.map(item => ({id: item.book_id, status: item.status, orderItemComment: item.comment}));
  const bookIds = orderItems.map(item => (item.book_id));
  const { data: bookItemsData } = await getBooksItems({ columns: `id, book_id, books(id,title,cover_image)`, bookIds: bookIds});
  bookItems.value = orderBookItems.map(item => {
    const matchingData = bookItemsData.find(data => data.book_id === item.id);
    if (matchingData) {
      return {
        ...item,
        title: matchingData.books.title,
        coverImage: matchingData.books.cover_image,
      };
    }

    return item;
  });
console.log('BOOK ITEMS => ', bookItems.value);

});
</script>