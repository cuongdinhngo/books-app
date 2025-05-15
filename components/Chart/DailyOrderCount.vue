<template>
  <div class="flex flex-wrap items-center justify-between mb-4">
    <h2 class="text-xl font-bold text-gray-900">Daily Order Chart</h2>
    <div class="w-48">
      <USelect
        v-model="period"
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
  <div class="chart-wrapper">
    <LineChart
      v-if="status === 'success'"
      :data="dailyOrderData"
      :height="275"
      y-label="Counts"
      :x-num-ticks="4"
      :y-num-ticks="4"
      :categories="categories"
      :x-formatter="xFormatter"
      :grid-line-y="true"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.Top"
    />
    <USkeleton
      v-if="status === 'pending'"
      class="h-[250px] w-full"
    />
  </div>
</template>
<script setup lang="ts">
const supabase = useSupabaseClient();

const period = ref(7);

const { data:dailyOrderData, error, status, refresh } = useAsyncData(
  `daily-order-count`,
  () => supabase.rpc('get_daily_order_counts', { period: period.value }),
  {
    transform: (data) => {
      return data.data.map((item: any) => ({
        date: useDateFormat(item.order_date, 'MMM DD').value,
        counts: item.order_count,
      }));
    },
  }
);

const categories: Record<string, BulletLegendItemInterface> = {
  counts: { name: 'counts', color: '#156F36' },
}

const xFormatter = computed(() => {
  return (i: number): string | number => {
    if (dailyOrderData.value && dailyOrderData.value[i]) {
      return dailyOrderData.value[i].date;
    }
    return '';
  };
});
</script>