<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Overview</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Categories</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_categories }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Publishers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_publishers }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Authors</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_authors }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_books }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Readers</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_readers }}</p>
        </div>
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Orders Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Orders</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_orders }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Borrowed Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.borrowed_orders }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Borrowing Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.borrowing_orders }}</p>
        </div>
        <div class="bg-yellow-200 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Overdue Orders</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.overdue_orders }}</p>
        </div>
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Book Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Book Items</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.total_book_items }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Available Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.available_books }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p class="text-sm font-medium text-gray-600">Total Lost Books</p>
            <p class="text-2xl font-semibold text-gray-900">{{ data?.lost_books }}</p>
        </div>
    </div>
  </div>

  <h3 class="text-stone-800 font-bold mb-1">Top Orders</h3>
  <UCarousel
    v-slot="{ item }"
    loop
    arrows
    :items="topOrderBooks"
    :ui="{
      item: 'basis-1/4',
      next: 'end-0',
      prev: 'start-0'
    }"
    class="p-5 bg-primary-50"
  >
    <BookRatingItem
      :book="item"
    />
  </UCarousel>
</template>

<script setup lang="ts">
const { data, error:dashboardError } = await useSupabaseClient().rpc('get_admin_dashboard_counts');

const { data:topOrderBooks , error:topOrderError } = await useSupabaseClient().rpc('get_top_ordered_books', { limit_count: 5 });
</script>
