<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <FormInputDiv
      v-model="title"
      label-name="Title"
      placeholder="Enter book's titlte"
    />

    <div>
      <label class="block text-sm font-medium text-gray-700">Publisher</label>
      <FilterPublisher
        v-model="selectedPublishers"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Category</label>
      <FilterCategory
        v-model="selectedCategories"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Author</label>
      <FilterAuthor
        v-model="selectedAuthors"
      />
    </div>

    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
      <FormCreateLink
        name="Create New Book"
        link="/admin/books/form"
      />
    </div>
  </form>

  <DataTable
    v-if="books.length > 0"
    :data="books"
    :columns="columns"
  />
  <h3 v-else class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="totalBooks > 0"
    :totalCounts="totalBooks"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const {books, totalBooks, perPage, searchBook} = useBooks();

const route = useRoute();
const page = ref(1);
const title = ref(null);
const selectedAuthors = ref(null);
const selectedCategories = ref(null);
const selectedPublishers = ref(null);

const UAvatar = resolveComponent('UAvatar');
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu');
const columns = [
  {
    accessorKey: 'bookId',
    header: '#',
    cell: ({ row }) => `#${row.getValue('bookId')}`
  },
  {
    accessorKey: 'coverImage',
    header: 'Book',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.coverImage,
          alt: row.original.title,
          size: '2xl',
          ui: {root: 'rounded-none'}
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted) text-stone-800' }, row.original.title),
        ])
      ])
    }
  },
  {
    accessorKey: 'publishers',
    header: `Publishers`,
    cell: ({ row }) => `${row.getValue('publishers').map(publisher => publisher.name).join(', ')}`
  },
  {
    accessorKey: 'authors',
    header: `Authors`,
    cell: ({ row }) => `${row.getValue('authors').map(author => author.name).join(', ')}`
  },
  {
    accessorKey: 'categories',
    header: `Categories`,
    cell: ({ row }) => `${row.getValue('categories').map(category => category.name).join(', ')}`
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
      to: `/admin/books/form?id=${row.original.bookId}`,
    },
    {
      label: 'Delete',
      onSelect() {
        // deletePublisher(row.original.id);
        // const newPage = getNewPage(Number(route.query.page), totalPublishers.value, perPage);
        // navigateTo(`/admin/publishers?page=${newPage}#with-links`);
      }
    }
  ]
}

const handleSearch = async() => {
  const searchTerm = {
    title: title.value,
    publisherId: selectedPublishers.value,
    authorIds: selectedAuthors.value,
    categoryIds: selectedCategories.value
  }

  await searchBook(searchTerm);
}

const handlePageChange = async(newPage) => {
  const searchTerm = {
    title: title.value,
    publisherIds: selectedPublishers.value,
    authorIds: selectedAuthors.value,
    categoryIds: selectedCategories.value
  }

  console.log('next page: ', newPage, searchTerm);

  await searchBook(searchTerm, Number(newPage));
}

onMounted(async() => {
  await searchBook();
});
</script>