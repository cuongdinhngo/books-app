<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.status"
    v-model:size="searchParams.size"
    title="Rating Books"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="[
      { id: `average_rating`, label: `Average Rating` },
      { id: `review_count`, label: `Review Counts` },
    ]"
  >
    <!-- Card Slot -->
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
          accessorKey: 'average_rating',
          header: 'Avg. Rating'
        },
        {
          accessorKey: 'review_count',
          header: 'Review counts'
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
import { PAGE_SIZE_OPTIONS } from '~/constants/common';

const supbase = useSupabaseClient();
const status = ref('average_rating');
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  status: status.value,
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus, refresh } = useAsyncData(
  `top-rating-book?status=${status.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ books, totalCount ] = await Promise.all([
      supbase.rpc(
        'get_top_rated_books',
        {
          p_sort_by: searchParams.value.status,
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supbase.rpc('get_top_rated_books_count'),
    ]);

    return {
      books: books.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);
</script>