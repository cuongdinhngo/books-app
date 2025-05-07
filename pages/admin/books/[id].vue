<template>
  <div class="bg-white p-6 w-full">
    <!-- Tabs Navigation -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="handleTabChange(tab.id)"
        :class="[
          'px-4 py-2 text-gray-600 font-medium border-b-2 focus:outline-none',
          activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-blue-500'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <div v-if="activeTab === 'details'" class="tab-content">
        <BookDetails />
      </div>

      <div v-if="activeTab === 'items'" class="tab-content">
        <BookHardCopy />
      </div>

      <div v-if="activeTab === 'orders'" class="tab-content">
        <BookHistoricalOrders />
      </div>

      <div v-if="activeTab === 'ratings'" class="tab-content">
        <BookRating />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
const router = useRouter();

const tabs = [
  { id: 'details', name: 'Details' },
  { id: 'items', name: 'Hard Copies' },
  { id: 'orders', name: 'Historical Orders' },
  { id: 'ratings', name: 'Ratings & Reviews' }
];
const activeTab = ref<string>(useRouteQuery('tab', 'details').value);

function handleTabChange(tabId: string) {
  activeTab.value = tabId;
  router.replace({ name: 'admin-books-id', query: { tab: tabId } });
}
</script>
