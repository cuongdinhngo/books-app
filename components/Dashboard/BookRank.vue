<template>
  <UCard class="h-full text-primary-50">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Book Rank</h2>
        <USelect v-model="copyStatus" value-key="id" :items="BOOK_COPY_OPTION" class="w-48" @change="refreshStatus"/>
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
              accessorKey: 'quantity',
              header: 'Quantity'
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
          show-edges
          :sibling-count="2"
          :update-page="handlePageChange"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { BOOK_COPY_OPTION } from '~/constants/bookCopies';

const { index:getBooks } = useBooks();

const copyStatus = ref(BOOK_COPY_OPTION[0].id);
const size = 10;
const page = ref(1);
const searchParams = ref({
  status: copyStatus.value === null ? [] : [copyStatus.value],
  isHead: true,
});

const { data, error, status:loadingStatus, refresh } = useAsyncData(
  `book-rank?status=${copyStatus.value}&page=${page.value}`,
  async() => {
    const [ books, totalCount ] = await Promise.all([
      useSupabaseClient().rpc('get_books_by_copy_status', { p_status: copyStatus.value, p_limit: size, p_offset: (page.value - 1) * size }),
      getBooks(searchParams.value),
    ]);

    console.log('books', books);
    console.log('totalCount', totalCount);

    return {
      books: books.data,
      count: totalCount.count,
    };
  },
  { watch: [page] }
);

function refreshStatus() {
  console.log('Refreshing status with copyStatus:', copyStatus.value);
  searchParams.value.status = copyStatus.value === null ? [] : [copyStatus.value];
  page.value = 1;
  refresh();
}

function handlePageChange(newPage) {
  page.value = newPage;
}

console.log('DATA => ', data);
console.log('error', error);
</script>