<template>
  <UCard class="h-full text-primary-50">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Rating Books</h2>
        <div class="flex items-center gap-3">
          <USelect 
            v-model="sortBy" 
            value-key="id"
            :items="[
              { id: `average_rating`, label: `Average Rating` },
              { id: `review_count`, label: `Review Counts` },
            ]"
            class="w-48" 
            @change="refreshSortBy"
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

const supbase = useSupabaseClient();
const sortBy = ref('average_rating');
const size = ref(PAGE_SIZE_OPTIONS[0].value);
const page = ref(1);
const searchParams = ref({
  sortBy: sortBy.value,
  isHead: true,
  page: page.value,
  size: size.value,
});

const { data, error, status:loadingStatus, refresh } = useAsyncData(
  `top-rating-book?status=${sortBy.value}&page=${page.value}&size=${size.value}`,
  async() => {
    const [ books, totalCount ] = await Promise.all([
      supbase.rpc(
        'get_top_rated_books',
        {
          p_sort_by: searchParams.value.sortBy,
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

function refreshSortBy() {
  page.value = 1;
  searchParams.value.page = 1;
  searchParams.value.sortBy = sortBy.value;
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