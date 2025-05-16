<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Overview Information</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminCard
        v-for="item in overviewCards"
        :key="item.id"
        :card="item"
      />
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Overview Orders</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminCard
        v-for="item in orderStats"
        :key="item.id"
        :card="item"
      />
    </div>
  </div>
  
  <div class="mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ChartOrderStats title="Order Stats" />
      <ChartBookStats title="Book Stats"/>
    </div>
  </div>

  <div class="mb-8">
    <ChartOrderCount />
  </div>

  <h3
    v-if="data?.topOrders.data.length > 0"
    class="text-stone-800 font-bold mb-1">Top Orders</h3>
  <UCarousel
    v-if="data?.topOrders.data.length > 0"
    v-slot="{ item }"
    loop
    arrows
    :items="data?.topOrders.data"
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
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { ORDER_STATUS } from '~/constants/orders';

const supabase = useSupabaseClient();

let overviewCards = [
  {
    id: 'total_categories',
    to: { name: "admin-categories" },
    label: 'Categories',
    count: 0
  },
  {
    id: 'total_publishers',
    to: { name: "admin-publishers" },
    label: 'Publishers',
    count: 0
  },
  {
    id: 'total_authors',
    to: { name: "admin-authors" },
    label: 'Authors',
    count: 0
  },
  {
    id: 'total_books',
    to: { name: "admin-books" },
    label: 'Books',
    count: 0
  },
  {
    id: 'total_readers',
    to: { name: "admin-readers" },
    label: 'Readers',
    count: 0
  },
];

let orderStats = [
  {
    id: 'total_orders',
    to: { name: "admin-orders", query: { status: [ORDER_STATUS.CLOSE, ORDER_STATUS.BORROWING, ORDER_STATUS.WAITING, ORDER_STATUS.REJECT] } },
    label: 'Orders',
    count: 0
  },
  {
    id: 'borrowed_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.CLOSE } },
    label: 'Closed Orders',
    count: 0
  },
  {
    id: 'borrowing_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.BORROWING } },
    label: 'Borrowing Orders',
    count: 0
  },
  {
    id: 'overdue_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.OVERDUE } },
    label: 'Overdue Orders',
    count: 0,
    class: 'bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-primary-50'
  },
];

let bookStats = [
  {
    id: 'total_book_copies',
    to: { name: "admin-books" },
    label: 'Hard Copies',
    count: 0
  },
  {
    id: 'available_books',
    to: { name: "admin-books", query: { status: BOOK_COPY_STATUS.OPENING } },
    label: 'Available Copies',
    count: 0
  },
  {
    id: 'lost_books',
    to: { name: "admin-books", query: { status: BOOK_COPY_STATUS.LOST } },
    label: 'Lost Copies',
    count: 0
  },
]
const { data, error:dashboardError } = await useAsyncData(
  'admin-dashboard',
  async() => {
    const[statistics, topOrders] = await Promise.all([
      supabase.rpc('get_admin_dashboard_counts'),
      supabase.rpc('get_top_ordered_books', { limit_count: 5 })
    ]);

    return {statistics, topOrders};
  }
);

overviewCards = overviewCards.map(card => {
  if (data.value?.statistics.data.hasOwnProperty(card.id)) {
    return {
      ...card,
      count: data.value?.statistics.data[card.id]
    };
  }
  return card;
});

orderStats = orderStats.map(card => {
  if (data.value?.statistics.data.hasOwnProperty(card.id)) {
    return {
      ...card,
      count: data.value?.statistics.data[card.id]
    };
  }
  return card;
});

bookStats = bookStats.map(card => {
  if (data.value?.statistics.data.hasOwnProperty(card.id)) {
    return {
      ...card,
      count: data.value?.statistics.data[card.id]
    };
  }
  return card;
});
</script>
