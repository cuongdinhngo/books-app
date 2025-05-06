<template>
  <div class="p-3">
    <UTable
      ref="table"
      v-if="bookItems.count > 0"
      :data="bookItems.data"
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
          :disabled="row.original.status === BOOK_ITEM_STATUS.LOST || row.original.status === BOOK_ITEM_STATUS.BORROWING"
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
          v-if="row.original.status !== BOOK_ITEM_STATUS.LOST && row.original.status !== BOOK_ITEM_STATUS.BORROWING"
          :ui="{
            label: 'text-stone-900'
          }"
          :key="row.original.id"
          variant="subtle"
          unchecked-icon="lucide-x"
          checked-icon="lucide-check"
          :label="row.original.status === BOOK_ITEM_STATUS.OPENING ? 'Disable' : 'Enable'"
          :modelValue="row.original.status === BOOK_ITEM_STATUS.OPENING"
          @update:modelValue="(value) => handleStatusChange(row, value)"
        />
      </template>
    </UTable>

    <div
      class="px-4 py-3.5 border-t border-accented text-sm text-muted text-stone-800"
    >
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </div>

    <div class="flex justify-end mt-4">
      <UButton
        label="Enable All"
        icon="lucide:handshake"
        color="primary"
        size="lg"
        @click="enableAll"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { en } from '@nuxt/ui/runtime/locale/index.js';
import { useRouteParams } from '@vueuse/router';
import { BOOK_ITEM_STATUS } from '~/constants/bookItems';

const { index, update, upsert } = useBookItems();

const bookId = useRouteParams('id', null, {transform: Number});
const table = useTemplateRef('table');

console.log('BOOK ID => ', bookId.value);
const { data:bookItems, error, refresh } = await useAsyncData(
  `book/${bookId.value}/items`,
  () => index({ bookIds: [bookId.value] })
);

console.log('DATA => ', bookItems);
console.log('ERROR => ', error.value);

const enableAll = async() => {
  const selectedRows = table?.value?.tableApi.getFilteredSelectedRowModel().rows;
  if (selectedRows.length === 0) {
    useToastError('Please select at least one item to enable.');
    return;
  }

  const updatedItems = selectedRows.map((row: any) => {
    row.original.status = 'opening';
    row.original.updated_at = new Date().toISOString();
    return row.original;
  });

  await upsert(updatedItems)
    .then(({ error }) => {
      if (error) throw error;

      table?.value?.tableApi.toggleAllPageRowsSelected(false);
      refresh();
      useToastSuccess('Book items status updated successfully!!!');
    })
    .catch((error) => useToastError(error));
};

const handleStatusChange = async(row: any, value: boolean) => {
  const newStatus = value ? 'opening' : 'pending';
  row.original.status = newStatus;
  await update(row.original.id, { status: newStatus })
    .then(({ error }) => {
      if (error) throw error;
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
}
</script>