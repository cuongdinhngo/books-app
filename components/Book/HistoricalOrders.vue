<template>
  <div class="p-3">
    <UTable
      v-if="status === 'success'"
      :data="data.data"
      class="flex-1"
      :columns="[
        {
          accessorKey: 'id',
          header: 'Order No.'
        },
        {
          accessorKey: 'book_copy_id',
          header: 'Hard Copy No.'
        },
        {
          accessorKey: 'status',
          header: 'Status',
          id: 'orderStatus'
        },
        {
          accessorKey: 'created_at',
          header: 'Ordered at',
          id: 'orderCreatedAt'
        },
        {
          accessorKey: 'returned_at',
          header: 'Returned at',
          id: 'orderReturnedAt',
        },
      ]"
    >

      <template #orderStatus-cell="{ row }">
        <UBadge class="capitalize" variant="subtle" :color="mapBadgeColor[row.original.status]">
          {{ row.original.status }}
        </UBadge>
      </template>

      <template #orderCreatedAt-cell="{ row }">
        {{ useDateFormat(row.original.created_at, 'MMMM Do, YYYY') }}
      </template>

      <template #orderReturnedAt-cell="{ row }">
        {{ row.original.returned_at ? useDateFormat(row.original.returned_at, 'MMMM Do, YYYY') : 'Not returned' }}
      </template>
    </UTable>
    <LoadingProcess v-if="status === 'pending'" />

    <div class="mt-6 flex justify-center space-x-2 text-stone-950" id="with-links">
      <UPagination
        v-if="status === 'success'"
        v-model:page="page"
        :total="data.count"
        :items-per-page="pageSize"
        show-edges
        :sibling-count="2"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';
const { index:getOrders} = useOrders();

const bookId = useRouteParams('id', null, { transform: Number });
const page = useRouteQuery('page', 1, { transform: Number });
const bookCopyId = useRouteQuery('copy', null, { transform: Number });
const pageSize = 10;
const searchParams = ref({
  bookId: bookId.value,
  bookCopyId: bookCopyId.value,
  page: page.value,
  size: pageSize,
});

const mapBadgeColor = {
  opening: 'success',
  pending: 'info',
  borrowing: 'warning',
  lost: 'error',
  closed: 'success',
  rejected: 'neutral',
}

function handlePageChange(newPage) {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const { data, error, status } = useAsyncData(
  `book/${bookId.value}/orders/page/${page.value}`,
  () => getOrders({...searchParams.value}),
  { watch: [searchParams.value] }
);
if (error.value) {
  useToastError(error.value);
}
</script>