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
        link="/admin/categories/form"
      />
    </div>
  </form>

  <DataTable
    :data="category?.data"
    :columns="columns"
    :get-dropdown-actions="getActionItems"
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
const route = useRoute();
const { index, remove } = useCategories();
const selectedCategories = ref([]);
const pageSize = 5;
const page = ref(Number(route.query.page) || 1);
const searchParams = ref({
  columns: 'id,name',
  ids: selectedCategories.value,
  page: page.value,
  size: pageSize
});


const { data: category, error, refresh } = await useAsyncData(
  `categories-page-${page.value}`,
  () => index(searchParams.value),
  {
    watch: [searchParams.value]
  }
);

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
    id: 'actions'
  }
]

const getActionItems = (category: Tables<'categories'>) => {
  return [
    {
      label: 'Update information',
      to: `/admin/categories/form?id=${category.id}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        const { error } = await remove(Number(category.id));
        if (null === error) {
          const { count } = await index();
          if (count) {
            const newPage = getNewPage(page.value, count, pageSize);
            if (page.value !== newPage) {
              page.value = newPage;
              navigateTo(`/admin/categories?page=${newPage}#with-links`);
            } else {
              refresh();
            }
          }
        }
      }
    }
  ]
}

const handleSearch = async() => {
  searchParams.value.ids = selectedCategories.value;
  searchParams.value.page = 1;
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};
</script>