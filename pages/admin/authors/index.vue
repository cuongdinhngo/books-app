<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div>
      <FilterAuthor
        v-model="selectedAuthors"
      />
    </div>
    <div class="flex justify-between gap-4">
      <button type="submit" 
        class="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
      <a href="/admin/authors/form" 
        class="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 text-center"
      >
        Create New Author
      </a>
    </div>
  </form>

  <UTable
    v-if="authors?.length > 0"
    :data="authors"
    :columns="columns"
    class="flex-1"
  />

  <div class="mt-6 flex justify-center space-x-2 text-stone-950" id="with-links">
    <UPagination
      v-if="totalAuthors > 0"
      v-model="page"
      show-edges
      :sibling-count="2"
      :items-per-page="perPage || 10"
      :total="totalAuthors"
      :to="toPage"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup>
const route = useRoute();
const { authors, searchAuthors, deleteAuthor, totalAuthors, perPage, getNewPage, getTotalCount, toPage } = useAuthors();
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
    header: 'Birth Year'
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
  await searchAuthors(selectedAuthors.value, Number(route.query.page));
});

onBeforeMount(() => {
  page.value = Number(route.query.page);
});
</script>