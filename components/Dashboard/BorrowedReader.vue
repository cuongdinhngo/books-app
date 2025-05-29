<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.status"
    v-model:size="searchParams.size"
    title="Borrowed Reader"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="[
      { id: ORDER_STATUS.CLOSE, label: capitalize(ORDER_STATUS.CLOSE) },
      { id: ORDER_STATUS.REJECT, label: capitalize(ORDER_STATUS.REJECT) },
      { id: ORDER_STATUS.LOST, label: capitalize(ORDER_STATUS.LOST) },
    ]"
  >
    <UTable
      v-if="loadingStatus === 'success'"
      :data="data.readers"
      :columns="[
        {
          accessorKey: 'name',
          header: 'Reader',
          id: 'reader',
        },
        {
          accessorKey: 'borrowed_count',
          header: 'Counts'
        },
      ]"
      class="flex-1 max-h-[320px]"
    >
      <template #reader-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-readers-id', params: { id: row.original.reader_id }}">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.photo || publicAsset('img/human.jpg')" class="rounded-none"/>
            <div>
              <p class="font-medium text-stone-800">{{ row.original.name}}</p>
            </div>
          </div>
        </NuxtLink>
      </template>
    </UTable>
  </DashboardCard>
</template>

<script lang="ts" setup>
import { PAGE_SIZE_OPTIONS } from '~/constants/common';
import { ORDER_STATUS } from '~/constants/orders';

const supbase = useSupabaseClient();
const orderStatus = ref(ORDER_STATUS.CLOSE);
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  status: orderStatus.value,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus, refresh } = useAsyncData(
  `top-borrowed-reader?status=${orderStatus.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ readers, totalCount ] = await Promise.all([
      supbase.rpc(
        'get_top_borrowed_readers',
        {
          p_status: searchParams.value.status,
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supbase.rpc(
        'get_top_borrowed_readers_count',
        {
          p_status: searchParams.value.status,
        }
      ),
    ]);

    return {
      readers: readers.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);

function refreshStatus() {
  page.value = 1;
  searchParams.value.page = 1;
  searchParams.value.status = orderStatus.value;
}

function handlePageChange(newPage) {
  page.value = newPage;
  searchParams.value.page = newPage;
}

function handleSizeChange() {
  page.value = 1;
  searchParams.value.size = size.value;
  searchParams.value.page = 1;
}
</script>