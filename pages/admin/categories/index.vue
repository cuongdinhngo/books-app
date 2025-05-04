<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div>
      <FilterCategory
        v-model="selectedCategories"
      />
    </div>
    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
      <FormCreateLink
        name="Create New Categories"
        :to="{ name: 'admin-categories-create' }"
      />
    </div>
  </form>

  <DataTable
    v-if="category?.data"
    :data="category?.data"
    :columns="columns"
    edit-link="admin-categories-id"
    :delete-item="deleteCategory"
  />

  <Pagination
    v-model="page"
    v-if="category?.count"
    :total-counts="category.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'
import { useRouteQuery } from '@vueuse/router';

const { index, remove } = useCategories();
const selectedCategories = ref([]);
const pageSize = 5;
const page = ref(useRouteQuery('page', 1, { transform: Number }));
const searchParams = ref({
  columns: 'id,name',
  ids: selectedCategories.value,
  page: page.value,
  size: pageSize
});

const { data: category, refresh } = await useAsyncData(
  `categories-page-${page.value}`,
  () => index(searchParams.value),
  {
    watch: [searchParams.value]
  }
);

const deleteCategory = async(categoryId) => {
  const response = window.confirm('Are you sure to delete this category');
  if (!response) {
    return;
  }

  await remove(categoryId)
    .then(async({ error }) => {
      if (error) throw error;

      useToastSuccess();
      const { count } = await index();
      if (count) {
        const newPage = getNewPage(page.value, count, pageSize);
        if (page.value !== newPage) {
          navigateTo(`/admin/categories?page=${newPage}#with-links`);
        } else {
          refresh();
        }
      }
    })
    .catch((error) => useToastError(error));
}

const handleSearch = async() => {
  searchParams.value.ids = selectedCategories.value;
  searchParams.value.page = 1;
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: `Category's name`,
  },
  {
    header: 'Actions',
    id: 'crud-actions'
  }
]
</script>