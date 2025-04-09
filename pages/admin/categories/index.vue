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
    :data="categories"
    :columns="columns"
  />

  <Pagination
    v-model="page"
    v-if="totalCategories > 0"
    :totalCounts="totalCategories"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const route = useRoute();
const { categories, searchCategories, totalCategories, perPage, deleteCategory} = useCategories();
const selectedCategories = ref([]);
const page = ref(1);

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
            items: getActionItems(row),
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

function getActionItems(row) {
  return [
    {
      label: 'Update information',
      to: `/admin/categories/form?id=${row.original.id}`,
    },
    {
      label: 'Delete',
      onSelect() {
        deleteCategory(row.original.id);
        const newPage = getNewPage(Number(route.query.page), totalCategories.value, perPage);
        navigateTo(`/admin/categories?page=${newPage}#with-links`);
      }
    }
  ]
}

const handleSearch = async() => {
  await searchCategories([...selectedCategories.value]);
}

const handlePageChange = async(newPage) => {
  await searchCategories(selectedCategories.value, newPage);
};

onMounted(async() => {
  page.value = Number(route.query.page);
  await searchCategories(selectedCategories.value, Number(route.query.page) || 1);
});
</script>