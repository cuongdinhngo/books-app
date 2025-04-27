<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Overview</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Categories</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.categoryCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Publishers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.publisherCounts}}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Authors</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.authorCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.bookCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Readers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.readerCounts }}</p>
        </div>
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Borrowing Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Orders</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.orderCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Borrowed Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.borrowedBookCounts}}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Borrowing Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.borrowingBookCounts }}</p>
        </div>
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Book Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Book Items</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.bookItemsCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Available Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.availableBookCounts }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Lost Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats?.lostBookCounts }}</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ORDER_ITEM_STATUS } from '~/composables/orderItems';
import { BOOK_ITEM_STATUS } from '~/composables/bookItems';

const { index: getCatetoryCounts } = useCategories();
const { index: getPublisherCounts } = usePublishers();
const { index: getAuthorCounts } = useAuthors();
const { index: getBookCounts} = useBooks();
const { index: getReaderCounts } = useReaders();
const { index: getOrderCounts } = useOrders();
const { index: getOrderItemCounts } = useOrderItems();
const { index: getBookItemsCounts } = useBookItems();

const { data: stats, error } = await useAsyncData('overview-statistics', async () => {
  const [
    category,
    publisher,
    author,
    book,
    reader,
    order,
    borrowedOrderItems,
    borrowingOrderItems,
    bookItems,
    availableBooks,
    lostBooks
  ] = await Promise.all([
    getCatetoryCounts(),
    getPublisherCounts(),
    getAuthorCounts(),
    getBookCounts(),
    getReaderCounts(),
    getOrderCounts(),
    getOrderItemCounts({ status:ORDER_ITEM_STATUS.CLOSED }),
    getOrderItemCounts({ status:ORDER_ITEM_STATUS.BORROWING }),
    getBookItemsCounts(),
    getBookItemsCounts({ status: [BOOK_ITEM_STATUS.OPENING] }),
    getBookItemsCounts({ status: [BOOK_ITEM_STATUS.LOST] })
  ]);

  return {
    categoryCounts: category.count,
    publisherCounts: publisher.count,
    authorCounts: author.count,
    bookCounts: book.count,
    readerCounts: reader.count,
    orderCounts: order.count,
    borrowedBookCounts: borrowedOrderItems.count,
    borrowingBookCounts: borrowingOrderItems.count,
    bookItemsCounts: bookItems.count,
    availableBookCounts: availableBooks.count,
    lostBookCounts: lostBooks.count
  }
});

console.error(error);
</script>