<template>
  <UCard class="h-full text-primary-50">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Book Stats</h2>
        <div class="flex items-center gap-3">
          <USelect 
            v-model="copyStatus" 
            value-key="id"
            :items="[
              { id: BOOK_COPY_STATUS.PENDING, label: capitalize(BOOK_COPY_STATUS.PENDING) },
              { id: BOOK_COPY_STATUS.OPENING, label: capitalize(BOOK_COPY_STATUS.OPENING) },
              { id: BOOK_COPY_STATUS.BORROWING, label: capitalize(BOOK_COPY_STATUS.BORROWING) },
              { id: BOOK_COPY_STATUS.LOST, label: capitalize(BOOK_COPY_STATUS.LOST) },
              { id: BOOK_COPY_STATUS.RETIRED, label: capitalize(BOOK_COPY_STATUS.RETIRED) },
              { id: BOOK_COPY_STATUS.UNAVAILABLE, label: capitalize(BOOK_COPY_STATUS.UNAVAILABLE) },
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
          :sibling-count="2"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { BOOK_COPY_OPTION, BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { PAGE_SIZE_OPTIONS } from '~/constants/common';

const { index:getBooks } = useBooks();

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
      useSupabaseClient().rpc(
        'get_books_by_copy_status',
        {
          p_status: searchParams.value.status[0],
          p_limit: searchParams.value.size,
          p_offset: (searchParams.value.page - 1) * searchParams.value.size,
        }
      ),
      getBooks(searchParams.value),
    ]);

    return {
      books: books.data,
      count: totalCount.count,
    };
  },
  { watch: [ searchParams.value ] }
);

function refreshStatus() {
  page.value = 1;
  searchParams.value.status = copyStatus.value === null ? [] : [copyStatus.value];
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