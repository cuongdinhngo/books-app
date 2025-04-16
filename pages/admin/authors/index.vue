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
    :data="author?.data"
    :columns="columns"
  />

  <Pagination
    v-model="page"
    v-if="author?.counts > 0"
    :totalCounts="author?.counts"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
const {
  searchAuthors,
  deleteAuthor,
  perPage,
  getTotalAuthorCounts
} = useAuthors();
const selectedAuthors = ref([]);
const page = ref(1);
const searchParams = ref({
  authors: selectedAuthors.value,
  page: page.value
});

const { data: author, refresh } = await useAsyncData(
  `author-page:${page.value}`,
  async() => {
    const data = await searchAuthors(searchParams.value.authors, searchParams.value.page);
    const counts = await getTotalAuthorCounts(searchParams.value.authors);

    console.log(`useAsyncData => author-page:${page.value} && COUNTS: ${counts}`);

    return {data,counts}
  }, {
    watch: [searchParams.value]
  }
)

const handleSearch = async() => {
  page.value = 1;
  searchParams.value = {
    authors: selectedAuthors.value,
    page: page.value
  }
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};

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

function getActionItems(authorId: Number) {
  return [
    {
      label: 'Update information',
      to: `/admin/authors/form?id=${authorId}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        await deleteAuthor(authorId);
        const authorCounts = await getTotalAuthorCounts(searchParams.value.authors);
        const newPage = getNewPage(page.value, authorCounts, perPage);
        if (page.value === newPage) {
          refresh();
        } else {
          navigateTo(`/admin/authors?page=${newPage}#with-links`);
        };
      }
    }
  ]
}
</script>