<template>
  <UCard class="h-full text-primary-50">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Borrowed Reader</h2>
        <div class="flex items-center gap-3">
          <USelect 
            v-model="orderStatus" 
            value-key="id"
            :items="[
              { id: ORDER_STATUS.CLOSE, label: capitalize(ORDER_STATUS.CLOSE) },
              { id: ORDER_STATUS.REJECT, label: capitalize(ORDER_STATUS.REJECT) },
              { id: ORDER_STATUS.LOST, label: capitalize(ORDER_STATUS.LOST) },
            ]"
            class="w-48" 
            @change="refreshStatus"
          />
          <USelect
            v-model="size" 
            :items="PAGE_SIZE_OPTIONS" 
            class="w-24" 
            placeholder="Size"
            @change="handleSizeChange"
          />
        </div>
      </div>
    </template>
    <div class="h-80">
      <div class="flex items-center justify-center h-full bg-gray-100 rounded">
        <!-- Chart component will go here -->
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
        <LoadingProcess v-if="loadingStatus === 'pending'"/>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center w-full" v-if="loadingStatus === 'success'">
        <p class="text-sm text-stone-100">
          Showing {{ (page - 1) * size + 1 }} to {{ Math.min(page * size, data.count) }} of {{ data.count }} entries
        </p>
        <UPagination
          v-model:page="page"
          :total="data.count"
          :items-per-page="size"
          :sibling-count="2"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </UCard>
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
  console.log('Updated searchParams:', searchParams.value);
}

function handleSizeChange() {
  page.value = 1;
  searchParams.value.size = size.value;
  searchParams.value.page = 1;
  console.log('Updated searchParams:', searchParams.value);
}
</script>