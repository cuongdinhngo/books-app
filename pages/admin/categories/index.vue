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
  />

  <Pagination
    v-model="page"
    v-if="category?.counts"
    :total-counts="category.counts"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
const route = useRoute();
const {
  searchCategories,
  totalCategoryCounts,
  perPage,
  deleteCategory,
  getTotalCategoryCounts
} = useCategories();
const selectedCategories = ref([]);
const page = ref(Number(route.query.page) || 1);
const searchParams = ref({
  categories: [],
  page: page.value
});

const { data: category, error, refresh } = await useAsyncData(
  `category-page:${page.value}`,
  async() => {
    const data = await searchCategories(searchParams.value.categories, searchParams.value.page);
    const counts = await getTotalCategoryCounts(searchParams.value.categories);
    console.log(`useAsyncData => category-page:${page.value} && COUNTS: ${counts}`);

    return {data,counts}
  }, {
    watch: [searchParams.value]
  }
)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu');
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
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getActionItems(Number(row.original.id)),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto text-stone-800',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

function getActionItems(categoryId: Number) {
  return [
    {
      label: 'Update information',
      to: `/admin/categories/form?id=${categoryId}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        await deleteCategory(Number(categoryId));
        totalCategoryCounts.value = await getTotalCategoryCounts();
        const newPage = getNewPage(Number(route.query.page), totalCategoryCounts.value, perPage);
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
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};
</script>