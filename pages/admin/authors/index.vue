<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div>
      <FilterAuthor
        v-model="selectedAuthors"
      />
    </div>
    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />

      <FormCreateLink
        name="Create New Author"
        link="/admin/authors/form"
      />
    </div>
  </form>

  <DataTable
    :data="authors"
    :columns="columns"
  />

  <Pagination
    v-model="page"
    v-if="totalAuthors > 0"
    :totalCounts="totalAuthors"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const route = useRoute();
const { authors, searchAuthors, deleteAuthor, totalAuthors, perPage } = useAuthors();
const selectedAuthors = ref([]);
const page = ref(1);

const UAvatar = resolveComponent('UAvatar');
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu');
const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'photo',
    header: 'Profile',
    cell: ({ row }) => {
      return h(UAvatar, { src: row.getValue('photo'), size: 'xl' })
    }
  },
  {
    accessorKey: 'fullname',
    header: 'Full Name',
  },
  {
    accessorKey: 'birthYear',
    header: 'Birth Year',
    cell: ({ row }) => row.getValue('birthYear') ? row.getValue('birthYear') : '----'
  },
  {
    accessorKey: 'deathYear',
    header: 'Death Year',
    cell: ({ row }) => row.getValue('deathYear') ? row.getValue('deathYear') : '----'
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
      to: `/admin/authors/form?id=${row.original.id}`,
    },
    {
      label: 'Delete',
      onSelect() {
        deleteAuthor(row.original.id);
        const newPage = getNewPage(Number(route.query.page), totalAuthors.value, perPage);
        navigateTo(`/admin/authors?page=${newPage}#with-links`);
      }
    }
  ]
}

const handleSearch = async() => {
  await searchAuthors([...selectedAuthors.value]);
}

const handlePageChange = async(newPage) => {
  await searchAuthors(searchAuthors.value, newPage);
};

onMounted(async() => {
  page.value = Number(route.query.page);
  await searchAuthors(selectedAuthors.value, Number(route.query.page) || 1);
});

onBeforeMount(() => {
  page.value = Number(route.query.page);
});
</script>