<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.status[0]"
    v-model:size="searchParams.size"
    title="Borrowed Book"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="[
      { id: ORDER_STATUS.CLOSE, label: capitalize(ORDER_STATUS.CLOSE) },
      { id: ORDER_STATUS.REJECT, label: capitalize(ORDER_STATUS.REJECT) },
      { id: ORDER_STATUS.LOST, label: capitalize(ORDER_STATUS.LOST) }
    ]"
  >
    <!-- Card slot -->
    <UTable
      v-if="loadingStatus === 'success'"
      :data="data.books"
      :columns="[
        {
          accessorKey: 'title',
          header: 'Title',
          id: 'book',
        },
        {
          accessorKey: 'borrowed_count',
          header: 'Counts'
        },
      ]"
      class="flex-1 max-h-[320px]"
    >
      <template #book-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-books-id', params: { id: row.original.book_id }, query: { tab: 'orders' } }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.cover_image" class="rounded-none"/>
            <div>
              <p class="font-medium text-stone-800">{{ row.original.title}}</p>
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
  status: orderStatus.value === null ? [] : [orderStatus.value],
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus } = useAsyncData(
  `top-borrowed-book?status=${orderStatus.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ books, totalCount ] = await Promise.all([
      supbase.rpc(
        'get_top_borrowed_books',
        {
          p_status: searchParams.value.status[0],
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supbase.rpc(
        'get_top_borrowed_books_count',
        {
          p_status: searchParams.value.status[0],
        }
      ),
    ]);

    return {
      books: books.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);
</script>