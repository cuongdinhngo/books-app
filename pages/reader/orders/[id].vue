<template>
  <!-- Information Block -->
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Borrowing Information</h3>
    <div class="space-y-2">
        <p class="text-gray-600">Status: <span class="font-semibold"> {{ order?.status }}</span></p>
        <p class="text-gray-600">Booked at: <span class="font-semibold">
          {{ order?.created_at ? readableDateTime(order?.created_at) : ''}}
        </span></p>
        <p v-if="order?.returned_at" class="text-gray-600">Returned at: <span class="font-semibold">
          {{ readableDateTime(order?.returned_at) }}
        </span></p>
    </div>
  </div>

  <div class="space-y-4">
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
  const { data } = await get(orderId.value, `id, status, created_at, returned_at, order_items(*)`);
  order.value = data;
  const orderItems = data.order_items;
  const orderBookItems = orderItems.map(item => ({id: item.book_item_id, status: item.status}));
  const bookItemIds = orderItems.map(item => (item.book_item_id));
  const { data: bookItemsData } = await getBooksItems({ columns: `bookItemId:id, book_id, books(id,title,cover_image)`, ids: bookItemIds});
  bookItems.value = orderBookItems.map(item => {
    const matchingData = bookItemsData.find(data => data.bookItemId === item.id);
    if (matchingData) {
      return {
        ...item,
        title: matchingData.books.title,
        coverImage: matchingData.books.cover_image,
      };
    }

    return item;
  });
});
</script>