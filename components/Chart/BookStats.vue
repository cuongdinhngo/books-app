<template>
  <div>
    <!-- Title and Period Selector -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">{{ title || 'Book Stats' }}</h2>
    </div>

    <!-- Chart -->
    <div class="chart-wrapper flex items-center justify-center">
      <DonutChart
        v-if="status === 'success' && sortedBookStats.length > 0"
        :data="sortedBookStats.map(i => i.value)"
        :height="275"
        :radius="0"
        :type="'full'"
        :labels="filteredStatusLabels"
      >
        <div class="absolute text-center">
          <div class="text-stone-800">
            <p
              v-for="item in sortedBookStats"
              :key="item.name"
            >
              {{ item.name }}: {{ item.value }} 
            </p>
          </div>
        </div>
      </DonutChart>

      <USkeleton
        v-if="status === 'pending'"
        class="h-[250px] w-[250px] rounded-full"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

const supabase = useSupabaseClient();

// Define all possible status labels
const statusLabels = [
  { id: BOOK_COPY_STATUS.OPENING, name: capitalize(BOOK_COPY_STATUS.OPENING), color: '#3b82f6' }, // Blue
  { id: BOOK_COPY_STATUS.BORROWING, name: capitalize(BOOK_COPY_STATUS.BORROWING), color: '#f59e0b' }, // Amber
  { id: BOOK_COPY_STATUS.PENDING, name: capitalize(BOOK_COPY_STATUS.PENDING), color: '#14b8a6' }, // Teal
  { id: BOOK_COPY_STATUS.LOST, name: capitalize(BOOK_COPY_STATUS.LOST), color: '#ef4444' }, // Red
];

const { data:bookStats, error, status, refresh } = useAsyncData(
  computed(() => `book-stats`).value,
  () => supabase.rpc('get_book_stats'),
  {
    transform: (data) => {
      return data.data.map((item: any) => {
        const statusItem = statusLabels.find((s) => s.id === item.status);
        return {
          value: item.status_count,
          name: statusItem ? statusItem.name : item.status,
          color: statusItem ? statusItem.color : '#000',
          id: item.status
        };
      });
    },
  }
);

const sortedBookStats = computed(() => {
  if (!bookStats.value) return [];
  return [...bookStats.value].sort((a, b) => a.name.localeCompare(b.name));
});

const filteredStatusLabels = computed(() => {
  if (!bookStats.value || !Array.isArray(bookStats.value) || bookStats.value.length === 0) {
    return statusLabels.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const statusIds = new Set(bookStats.value.map(item => item.id));
  
  return statusLabels
    .filter(label => statusIds.has(label.id))
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>