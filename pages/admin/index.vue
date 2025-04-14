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
</template>

<script setup lang="ts">
const { getTotalCategoryCounts } = useCategories();
const { getTotalPublisherCounts } = usePublishers();
const { getTotalAuthorCounts } = useAuthors();
const { getTotalBookCounts} = useBooks();
const { getTotalReaderCounts } = useReaders();
const { getTotalOrderCounts } = useOrders();
const { getTotalOrderItemCounts } = useOrderItems();

const { data: stats, error, status } = await useAsyncData('overview-statistics', async () => {
  const [
    categoryCounts,
    publisherCounts,
    authorCounts,
    bookCounts,
    readerCounts,
    orderCounts,
    borrowedBookCounts,
    borrowingBookCounts
  ] = await Promise.all([
    getTotalCategoryCounts(),
    getTotalPublisherCounts(),
    getTotalAuthorCounts(),
    getTotalBookCounts(),
    getTotalReaderCounts(),
    getTotalOrderCounts(),
    getTotalOrderItemCounts(),
    getTotalOrderItemCounts('borrowing')
  ]);

  return {
    categoryCounts,
    publisherCounts,
    authorCounts,
    bookCounts,
    readerCounts,
    orderCounts,
    borrowedBookCounts,
    borrowingBookCounts
  }
});
</script>