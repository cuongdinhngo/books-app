<template>
  <div>
    <!-- Title and Period Selector -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">{{ title || 'Book Stats' }}</h2>
    </div>

    <!-- Chart -->
    <div class="chart-wrapper flex items-center justify-center">
      <DonutChart
        v-if="bookStatus === 'success'"
        :data="sortedBookStats.map(i => i.value)"
        :height="275"
        :radius="0"
        :type="'full'"
        :labels="filteredStatusLabels"
        :hide-legend="true"
      >
        <div class="absolute text-center">
          <ChartSummaryStats
            :data="sortedBookStats"
            :labels="filteredStatusLabels"
          />
        </div>
      </DonutChart>

      <LoadingCard
        v-if="bookStatus === 'pending'"
        :quantity="1"
        :class-value="`h-[250px] w-[250px] rounded-full`"
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
  { id: BOOK_COPY_STATUS.OPENING, name: capitalize(BOOK_COPY_STATUS.OPENING), color: '#3b82f6', to: { name: 'admin-books', query: { status: [BOOK_COPY_STATUS.OPENING]}} }, // Blue
  { id: BOOK_COPY_STATUS.BORROWING, name: capitalize(BOOK_COPY_STATUS.BORROWING), color: '#f59e0b', to: { name: 'admin-books', query: { status: [BOOK_COPY_STATUS.BORROWING]}} }, // Amber
  { id: BOOK_COPY_STATUS.PENDING, name: capitalize(BOOK_COPY_STATUS.PENDING), color: '#14b8a6', to: { name: 'admin-books', query: { status: [BOOK_COPY_STATUS.PENDING]}} }, // Teal
  { id: BOOK_COPY_STATUS.LOST, name: capitalize(BOOK_COPY_STATUS.LOST), color: '#ef4444', to: { name: 'admin-books', query: { status: [BOOK_COPY_STATUS.LOST]}} }, // Red
  { id: BOOK_COPY_STATUS.RETIRED, name: capitalize(BOOK_COPY_STATUS.RETIRED), color: '#a1a1aa', to: { name: 'admin-books', query: { status: [BOOK_COPY_STATUS.RETIRED]}} }, // Gray
];

const { data:bookStats, error, status:bookStatus, refresh } = useAsyncData(
  `book-stats/${props.title}`,
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