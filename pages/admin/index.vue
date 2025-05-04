<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Overview</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminCard
        v-for="item in overviewCards"
        :key="item.id"
        :card="item"
      />
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Orders Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminCard
        v-for="item in orderStats"
        :key="item.id"
        :card="item"
      />
    </div>
  </div>

  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-900 mb-4">Book Stats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <AdminCard
        v-for="item in bookStats"
        :key="item.id"
        :card="item"
      />
    </div>
  </div>

  <h3 class="text-stone-800 font-bold mb-1">Top Orders</h3>
  <UCarousel
    v-slot="{ item }"
    loop
    arrows
    :items="data.topOrders.data"
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
const supabase = useSupabaseClient();
let overviewCards = [
  {
    id: 'total_categories',
    to: { name: "admin-categories" },
    label: 'Total Categories',
    count: 0
  },
  {
    id: 'total_publishers',
    to: { name: "admin-publishers" },
    label: 'Total Publishers',
    count: 0
  },
  {
    id: 'total_authors',
    to: { name: "admin-authors" },
    label: 'Total Authors',
    count: 0
  },
  {
    id: 'total_books',
    to: { name: "admin-books" },
    label: 'Total Books',
    count: 0
  },
  {
    id: 'total_readers',
    to: { name: "admin-readers" },
    label: 'Total Readers',
    count: 0
  },
];

let orderStats = [
  {
    id: 'total_orders',
    to: { name: "admin-orders", query: { status: [ORDER_STATUS.CLOSE, ORDER_STATUS.BORROWING, ORDER_STATUS.WAITING, ORDER_STATUS.REJECT] } },
    label: 'Total Orders',
    count: 0
  },
  {
    id: 'borrowed_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.CLOSE } },
    label: 'Total Borrowed Orders',
    count: 0
  },
  {
    id: 'borrowing_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.BORROWING } },
    label: 'Total Open Orders',
    count: 0
  },
  {
    id: 'overdue_orders',
    to: { name: "admin-orders", query: { status: ORDER_STATUS.OVERDUE } },
    label: 'Total Overdue Orders',
    count: 0,
    class: 'bg-yellow-100 p-4 rounded-lg shadow-sm hover:bg-primary-50'
  },
];

let bookStats = [
  {
    id: 'total_book_items',
    to: { name: "admin-books" },
    label: 'Total Book Items',
    count: 0
  },
  {
    id: 'available_books',
    to: { name: "admin-books", query: { status: BOOK_ITEM_STATUS.OPENING } },
    label: 'Total Available Books',
    count: 0
  },
  {
    id: 'lost_books',
    to: { name: "admin-books", query: { status: BOOK_ITEM_STATUS.LOST } },
    label: 'Total Lost Books',
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
