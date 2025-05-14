<template>
  <!-- Order Statistics -->
  <div class="grid grid-cols-6 gap-2 my-4">
    <NuxtLink
      :to="{ name: routeName, query: {
        readerId: readerId,
        status: [ ORDER_STATUS.WAITING, ORDER_STATUS.BORROWING, ORDER_STATUS.CLOSE, ORDER_STATUS.REJECT, ORDER_STATUS.LOST ]
      } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-blue-200 rounded-2xl cursor-pointer"
    >
      Total: {{ orderStats?.total || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: routeName, query: { status: [ ORDER_STATUS.WAITING ], readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-violet-300 rounded-2xl cursor-pointer"
    >
      Waiting: {{ orderStats?.waiting || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: routeName, query: { status: [ ORDER_STATUS.BORROWING ], readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-green-200 rounded-2xl cursor-pointer"
    >
      Borrowing: {{ orderStats?.borrowing || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: routeName, query: { status: [ ORDER_STATUS.CLOSE ], readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-orange-200 rounded-2xl cursor-pointer"
    >
      Closed: {{ orderStats?.closed || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: routeName, query: { status: [ ORDER_STATUS.REJECT ], readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-pink-200 rounded-2xl cursor-pointer"
    >
      Rejected: {{ orderStats?.rejected || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: routeName, query: { status: [ ORDER_STATUS.LOST ], readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-gray-300 rounded-2xl cursor-pointer"
    >
      Lost: {{ orderStats?.lost || 0 }}
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { ORDER_STATUS } from '~/constants/orders';

const props = defineProps({
  orders: {
    type: Object,
    required: true
  },
  routeName: {
    type: String,
    required: true
  },
  readerId: {
    type: String,
    required: true
  }
});

const orderStats = computed(() => {
  const items = props.orders.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const total = Number(items.waiting || 0) +
    Number(items.borrowing || 0) +
    Number(items.closed || 0) +
    Number(items.lost || 0) +
    Number(items.rejected || 0)
  ;

  return {
    total,
    waiting: items.waiting || 0,
    borrowing: items.borrowing || 0,
    closed: items.closed || 0,
    rejected: items.rejected || 0,
    lost: items.lost || 0
  };
});
</script>