<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.author"
    v-model:size="searchParams.size"
    title="Top Authors"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="authorOptions"
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
          accessorKey: 'author_name',
          header: 'Author'
        },
        {
          accessorKey: 'order_count',
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
import { PAGE_SIZE_OPTIONS, CATEGORY_ALL_ID, CATEGORY_ALL_LABEL } from '~/constants/common';

const { index:getAuthors } = useAuthors();

const supabase = useSupabaseClient();
const author = ref(CATEGORY_ALL_ID);
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  author: author.value,
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus } = useAsyncData(
  `book-by-author?author=${author.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ authors, books, totalCount ] = await Promise.all([
      getAuthors(),
      supabase.rpc(
        'get_top_books_by_author',
        {
          p_author_id: searchParams.value.author,
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supabase.rpc(
        'get_top_books_by_author_count',
        {
          p_author_id: searchParams.value.author,
        }
      )
    ]);

    return {
      authors: authors.data,
      books: books.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);

const authorOptions = computed(() => {
  return [
    { id: CATEGORY_ALL_ID, label: CATEGORY_ALL_LABEL },
    ...(data.value?.authors || []).map(author => ({
      id: author.id,
      label: author.full_name,
    })),
  ];
});
</script>