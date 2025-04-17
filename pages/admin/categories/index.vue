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
    v-if="category?.counts"
    :total-counts="category.counts"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types'
const route = useRoute();
const {
  getCategories,
  totalCategoryCounts,
  deleteCategory,
  getTotalCategoryCounts
} = useCategories();
const selectedCategories = ref([]);
const pageSize = 5;
const page = ref(Number(route.query.page) || 1);
const searchParams = ref({
  categories: [],
  page: page.value
});

const { data: category, error, refresh } = await useAsyncData(
  `category-page:${page.value}`,
  async() => {
    const categoriesOptions = {
      filterIds: searchParams.value.categories,
      page: searchParams.value.page,
      pageSize
    };
    const data = await getCategories(categoriesOptions);
    const counts = await getTotalCategoryCounts({ filterIds: searchParams.value.categories });
    console.log(`useAsyncData => category-page:${page.value} && COUNTS: ${counts}`);

    return {data,counts}
  }, {
    watch: [searchParams.value]
  }
)

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
        await deleteCategory(Number(category.id));
        totalCategoryCounts.value = await getTotalCategoryCounts();
        const newPage = getNewPage(page.value, totalCategoryCounts.value, pageSize);
        if (page.value !== newPage) {
          page.value = newPage;
          navigateTo(`/admin/categories?page=${newPage}#with-links`);
        } else {
          refresh();
        }
      }
    }
  ]
}

const handleSearch = async() => {
  searchParams.value.categories = selectedCategories.value;
  searchParams.value.page = 1;
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};
</script>