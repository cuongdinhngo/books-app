<template>
  <DashboardCard
    v-model:page="searchParams.page"
    v-model:status="searchParams.category"
    v-model:size="searchParams.size"
    title="Top Categories"
    :loading-status="loadingStatus"
    :total-count="loadingStatus === 'success' ? (data.count ?? 0) : 0"
    :status-options="categoryOptions"
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
          accessorKey: 'category_name',
          header: 'Category'
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
import { BOOK_COPY_OPTION, BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { PAGE_SIZE_OPTIONS, CATEGORY_ALL_ID, CATEGORY_ALL_LABEL } from '~/constants/common';

const { index:getCategories } = useCategories();

const supabase = useSupabaseClient();
const category = ref(CATEGORY_ALL_ID);
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  category: category.value,
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus } = useAsyncData(
  `book-by-category?category=${category.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ categories, books, totalCount ] = await Promise.all([
      getCategories(),
      supabase.rpc(
        'get_top_books_by_category',
        {
          p_category_id: searchParams.value.category,
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      supabase.rpc(
        'get_top_books_by_category_count',
        {
          p_category_id: searchParams.value.category,
        }
      )
    ]);

    return {
      categories: categories.data,
      books: books.data,
      count: totalCount.data,
    };
  },
  { watch: [ searchParams.value ] }
);

const categoryOptions = computed(() => {
  return [
    { id: CATEGORY_ALL_ID, label: CATEGORY_ALL_LABEL },
    ...(data.value?.categories || []).map(category => ({
      id: category.id,
      label: category.name,
    })),
  ];
});

console.log('DATA => ', data.value);
</script>