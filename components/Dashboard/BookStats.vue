<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.status[0]"
    v-model:size="searchParams.size"
    title="Book Stats"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="[
      { id: BOOK_COPY_STATUS.PENDING, label: capitalize(BOOK_COPY_STATUS.PENDING) },
      { id: BOOK_COPY_STATUS.OPENING, label: capitalize(BOOK_COPY_STATUS.OPENING) },
      { id: BOOK_COPY_STATUS.BORROWING, label: capitalize(BOOK_COPY_STATUS.BORROWING) },
      { id: BOOK_COPY_STATUS.LOST, label: capitalize(BOOK_COPY_STATUS.LOST) },
      { id: BOOK_COPY_STATUS.RETIRED, label: capitalize(BOOK_COPY_STATUS.RETIRED) },
      { id: BOOK_COPY_STATUS.UNAVAILABLE, label: capitalize(BOOK_COPY_STATUS.UNAVAILABLE) },
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
          accessorKey: 'quantity',
          header: 'Qty'
        },
      ]"
      class="flex-1 max-h-[320px]"
    >
      <template #book-cell="{ row }">
        <NuxtLink :to="{ name: 'admin-books-id', params: { id: row.original.book_id }}">
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
import { BOOK_COPY_OPTION, BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { PAGE_SIZE_OPTIONS } from '~/constants/common';

const supabase = useSupabaseClient();
const copyStatus = ref(BOOK_COPY_OPTION[0].id);
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  status: copyStatus.value === null ? [] : [copyStatus.value],
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus } = useAsyncData(
  `book-rank?status=${copyStatus.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ books, totalCount ] = await Promise.all([
      supabase.rpc(
        'get_books_by_copy_status',
        {
          p_status: searchParams.value.status[0],
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supabase.rpc(
        'get_books_by_copy_status_count',
        {
          p_status: searchParams.value.status[0],
        }
      )
    ]);

    return {
      books: books.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);
</script>