<template>
  <div>
    <!-- Title and Period Selector -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">{{ title || 'Order Stats' }}</h2>
      <div class="w-48">
        <USelect
          v-model="localPeriod"
          :items="[
            { label: 'Last 7 Days', value: 7 },
            { label: 'Last 14 Days', value: 14 },
            { label: 'Last 30 Days', value: 30 },
            { label: 'Last 60 Days', value: 60 },
            { label: 'Last 90 Days', value: 90 }
          ]"
          value-key="value"
          placeholder="Select Period"
          class="w-48 bg-primary-50 text-stone-900"
          variant="subtle"
          @change="refresh"
        />
      </div>
    </div>

    <!-- Chart -->
    <div class="chart-wrapper flex items-center justify-center">
      <DonutChart
        v-if="status === 'success' && sortedOrderStats.length > 0"
        :data="sortedOrderStats.map(i => i.value)"
        :height="275"
        :radius="0"
        :type="'full'"
        :labels="filteredStatusLabels"
        :hide-legend="true"
      >
        <div class="absolute text-center">
          <ChartSummaryStats
            :data="sortedOrderStats"
            :labels="filteredStatusLabels"
          />
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
import { ORDER_STATUS } from '~/constants/orders';

const props = defineProps({
  period: {
    type: Number,
    default: 7
  },
  title: {
    type: String,
    default: ''
  }
});

const supabase = useSupabaseClient();

const localPeriod = ref(props.period);

const statusLabels = [
  { id: ORDER_STATUS.WAITING, name: capitalize(ORDER_STATUS.WAITING), color: '#3b82f6', to: { name: 'admin-orders', query: { status:[ORDER_STATUS.WAITING]}} }, // Blue
  { id: ORDER_STATUS.BORROWING, name: capitalize(ORDER_STATUS.BORROWING), color: '#f59e0b', to: { name: 'admin-orders', query: { status:[ORDER_STATUS.BORROWING]}} }, // Amber
  { id: ORDER_STATUS.CLOSE, name: capitalize(ORDER_STATUS.CLOSE), color: '#14b8a6', to: { name: 'admin-orders', query: { status:[ORDER_STATUS.CLOSE]}} }, // Teal
  { id: ORDER_STATUS.REJECT, name: capitalize(ORDER_STATUS.REJECT), color: '#6b7280', to: { name: 'admin-orders', query: { status:[ORDER_STATUS.REJECT]}} }, // Gray
  { id: ORDER_STATUS.LOST, name: capitalize(ORDER_STATUS.LOST), color: '#ef4444', to: { name: 'admin-orders', query: { status:[ORDER_STATUS.LOST]}} }, // Red
];

const { data:orderStats, error, status, refresh } = useAsyncData(
  computed(() => `order-stats/period/${localPeriod.value}`).value,
  () => supabase.rpc('get_order_status_stats', { period: localPeriod.value }),
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

const sortedOrderStats = computed(() => {
  if (!orderStats.value) return [];
  return [...orderStats.value].sort((a, b) => a.name.localeCompare(b.name));
});

const filteredStatusLabels = computed(() => {
  if (!orderStats.value || !Array.isArray(orderStats.value) || orderStats.value.length === 0) {
    return statusLabels.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const statusIds = new Set(orderStats.value.map(item => item.id));
  
  return statusLabels
    .filter(label => statusIds.has(label.id))
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>