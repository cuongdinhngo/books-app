<template>
  <div class="p-3">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      <div class="flex items-center space-x-2">
        <label class="block text-sm font-medium text-gray-700">Quantity</label>
        <UInputNumber
          v-model="quantity"
          orientation="vertical"
          placeholder="Enter quantity"
          variant="subtle"
          :min="0"
        />
        <UButton
          label="Submit"
          icon="lucide:arrow-up-from-line"
          color="primary"
          size="lg"
          @click="submitItems"
        />
      </div>
    </div>

    <!-- INVENTORY -->
    <div class="grid grid-cols-6 gap-4 my-3">
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-blue-200 rounded-2xl cursor-pointer"
        @click="searchByStatus('')"
      >
        Total: {{ totalCounts }}
      </label>
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-violet-300 rounded-2xl cursor-pointer"
        @click="searchByStatus(BOOK_COPY_STATUS.PENDING)"
      >
        Pending: {{ pendingCounts }}
      </label>
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-green-200 rounded-2xl cursor-pointer"
        @click="searchByStatus(BOOK_COPY_STATUS.OPENING)"
      >
        Opening: {{ openingCounts }}
      </label>
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-orange-200 rounded-2xl cursor-pointer"
        @click="searchByStatus(BOOK_COPY_STATUS.BORROWING)"
      >
        Borrowing: {{ borrowingCounts }}
      </label>
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-gray-300 rounded-2xl cursor-pointer"
        @click="searchByStatus(BOOK_COPY_STATUS.LOST)"
      >
        Lost: {{ lostCounts }}
      </label>
      <label
        class="w-30 text-sm font-medium text-gray-700 p-2 bg-purple-400 rounded-2xl cursor-pointer"
        @click="searchByStatus(BOOK_COPY_STATUS.RETIRED)"
      >
        Retired: {{ retiredCounts }}
      </label>
    </div>

    <div
      v-if="itemStatus.length > 0 ? bookCopies?.perPage.count : bookCopies?.all.count"
      class="flex justify-start mt-10 gap-4"
    >
      <UButton
        label="Enable"
        icon="lucide:handshake"
        color="primary"
        size="lg"
        @click="updateMultipleCopies(BOOK_COPY_STATUS.OPENING)"
      />

      <UButton
        label="Retire"
        icon="lucide:book-lock"
        color="primary"
        size="lg"
        @click="updateMultipleCopies(BOOK_COPY_STATUS.RETIRED)"
      />
    </div>

    <UTable
      ref="table"
      v-if="bookCopies?.perPage.count > 0"
      :data="bookCopies?.perPage.data"
      class="flex-1"
      :columns="[
        {
          id: 'select'
        },
        {
          accessorKey: 'id',
          header: 'Item ID',
        },
        {
          accessorKey: 'status',
          header: 'Status',
        },
        {
          accessorKey: 'created_at',
          header: 'Created at',
          id: 'createdAt'
        },
        {
          accessorKey: 'actions',
          header: 'Actions',
          id: 'actions'
        }
      ]"
    >

      <template #select-header="{ table }">
        <UCheckbox
          :model-value="table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()"
          v-on:update:model-value="(value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)"
        />
      </template>

      <template #select-cell="{ row }">
        <UCheckbox
          :disabled="row.original.status === BOOK_COPY_STATUS.LOST || row.original.status === BOOK_COPY_STATUS.BORROWING"
          :key="row.original.id"
          :model-value="row.getIsSelected()"
          v-on:update:model-value="(value: boolean | 'indeterminate') => row.toggleSelected(!!value)"
        />
      </template>

      <template #status-cell="{ row }">
        <UBadge class="capitalize" variant="subtle" :color="bookItemStatusColor[row.original.status]">
          {{ row.original.status }}
        </UBadge>
      </template>

      <template #createdAt-cell="{ row }">
        {{ useDateFormat(row.original.created_at, 'MMMM Do, YYYY') }}
      </template>

      <template #actions-cell="{ row }">
        <USwitch
          v-if="[BOOK_COPY_STATUS.OPENING, BOOK_COPY_STATUS.PENDING].includes(row.original.status)"
          :ui="{
            label: 'text-stone-900'
          }"
          :key="row.original.id"
          variant="subtle"
          unchecked-icon="lucide-x"
          checked-icon="lucide-check"
          :label="row.original.status === BOOK_COPY_STATUS.OPENING ? 'Disable' : 'Enable'"
          :modelValue="row.original.status === BOOK_COPY_STATUS.OPENING"
          @update:modelValue="(value) => handleStatusChange(row, value)"
        />
      </template>
    </UTable>

    <div
      v-if="itemStatus.length > 0 ? bookCopies?.perPage.count : bookCopies?.all.count"
      class="px-4 py-3.5 text-sm text-muted text-stone-800"
    >
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>

    <Pagination
      v-model="page"
      v-if="itemStatus.length > 0 ? bookCopies?.perPage.count : bookCopies?.all.count"
      :totalCounts="itemStatus.length > 0 ? bookCopies?.perPage.count : bookCopies?.all.count"
      :items-per-page="pageSize"
      @changePage="handlePageChange"
    />
    <h3 v-else class="flex justify-center text-stone-900 mt-5">No Data</h3>
  </div>
</template>

<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';

const { index, update, upsert } = useBookCopies();

const bookId = useRouteParams('id', null, {transform: Number});
const page = useRouteQuery('page', 1, { transform: Number });
const pageSize = 5;

const table = useTemplateRef('table');
const totalCounts = ref(0);
const pendingCounts = ref(0);
const openingCounts = ref(0);
const borrowingCounts = ref(0);
const lostCounts = ref(0);
const retiredCounts = ref(0);
const quantity = ref(0);
const itemStatus = ref<string[]>([]);
const searchParams = ref({
  bookIds: [bookId.value],
  status: itemStatus.value,
  page: page.value,
  size: pageSize
});

const { data:bookCopies, error, refresh } = await useAsyncData(
  `book/${bookId.value}/items/page/${page.value}`,
  async() => {
    const [ all, perPage ] = await Promise.all([
      index({ bookIds: [bookId.value] }),
      index(searchParams.value)
    ]);

    return { all, perPage}
  },
  {
    watch: [searchParams.value]
  }
);

console.log('bookCopies', bookCopies.value);

processItems(bookCopies.value?.all.data);

function searchByStatus (status: string) {
  console.log('searchByStatus', status);
  page.value = 1;
  if (status.length === 0) {
    itemStatus.value = [];
  } else {
    itemStatus.value = [status];
  }

  searchParams.value.status = itemStatus.value;
  searchParams.value.page = page.value;
}

function processItems (data: any[]) {
  console.log('processItems', data);
  const items = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  pendingCounts.value = items.pending || 0;
  openingCounts.value = items.opening || 0;
  borrowingCounts.value = items.borrowing || 0;
  lostCounts.value = items.lost || 0;
  retiredCounts.value = items.retired || 0;
  totalCounts.value = bookCopies.value?.all.count || 0;
}

function handlePageChange (newPage: number) {
  page.value = newPage;
  searchParams.value.page = newPage;
}

async function submitItems() {
  if (quantity.value <= 0) {
    useToastError(null, 'Please enter a valid quantity.');
    return;
  }

  const newItems = Array.from({ length: quantity.value }, () => ({
    book_id: bookId.value,
    status: BOOK_COPY_STATUS.PENDING,
    created_at: new Date().toISOString(),
  }));

  await upsert(newItems)
    .then(({ error }) => {
      if (error) throw error;

      quantity.value = 0;
      refresh().then(() => {
        processItems(bookCopies.value.all.data);
      });

      useToastSuccess('Book copies added successfully!!!');
    })
    .catch((error) => useToastError(error));
};


async function updateMultipleCopies(selectedStatus: string) {
  const selectedRows = table?.value?.tableApi.getFilteredSelectedRowModel().rows;
  if (selectedRows.length === 0) {
    useToastError('Please select at least one item to enable.');
    return;
  }

  let updatedItems = [];
  if (selectedStatus === BOOK_COPY_STATUS.OPENING) {
    updatedItems = selectedRows
      .filter((row: any) => [BOOK_COPY_STATUS.PENDING, BOOK_COPY_STATUS.RETIRED].includes(row.original.status))
      .map((row: any) => {
        row.original.status = BOOK_COPY_STATUS.OPENING;
        row.original.updated_at = new Date().toISOString();

        return row.original;
      });
  }

  if (selectedStatus === BOOK_COPY_STATUS.RETIRED) {
    updatedItems = selectedRows
      .filter((row: any) => [BOOK_COPY_STATUS.OPENING, BOOK_COPY_STATUS.PENDING].includes(row.original.status))
      .map((row: any) => {
        row.original.status = BOOK_COPY_STATUS.RETIRED;
        row.original.updated_at = new Date().toISOString();

        return row.original;
      });
  }

  await upsert(updatedItems)
    .then(({ error }) => {
      if (error) throw error;

      table?.value?.tableApi.toggleAllPageRowsSelected(false);
      refresh().then(() => {
        processItems(bookCopies.value.all.data);
      });
      useToastSuccess('Book items status updated successfully!!!');
    })
    .catch((error) => useToastError(error));
};

const handleStatusChange = async(row: any, value: boolean) => {
  const newStatus = value ? BOOK_COPY_STATUS.OPENING : BOOK_COPY_STATUS.PENDING;
  row.original.status = newStatus;
  await update(row.original.id, { status: newStatus })
    .then(({ error }) => {
      if (error) throw error;

      refresh().then(() => {
        processItems(bookCopies.value.all.data);
      });
      useToastSuccess(`Book item #${row.original.id} status updated successfully!!!`);
    })
    .catch((error) => useToastError(error));
};

const bookItemStatusColor = {
  opening: 'success',
  pending: 'primary',
  borrowing: 'warning',
  lost: 'error',
  rejected: 'neutral',
  closed: 'neutral',
  retired: 'neutral',
}
</script>