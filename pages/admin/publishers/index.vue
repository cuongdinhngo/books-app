<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div>
      <FilterPublisher
        v-model="selectedPublishers"
      />
    </div>
    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
      <FormCreateLink
        name="Create New Publisher"
        link="/admin/publishers/form"
      />
    </div>
  </form>

  <DataTable
    :data="publisher.data"
    :columns="columns"
  />

  <Pagination
    v-model="page"
    v-if="publisher?.counts > 0"
    :totalCounts="publisher.counts"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const {
  searchPublishers,
  perPage,
  deletePublisher,
  getTotalPublisherCounts
} = usePublishers();
const selectedPublishers = ref([]);
const page = ref(1);
const searchParams = ref({
  publishers: selectedPublishers.value,
  page: page.value
});

const { data: publisher, refresh } = await useAsyncData(
  `publisher-page:${page.value}`,
  async() => {
    const data = await searchPublishers(searchParams.value.publishers, searchParams.value.page);
    const counts = await getTotalPublisherCounts(searchParams.value.publishers);
    console.log(`useAsyncData => publisher-page:${page.value} && COUNTS: ${counts}`);

    return { data, counts }
  }, {
    watch: [searchParams.value]
  }
)

const handleSearch = async() => {
  searchParams.value.publishers = selectedPublishers.value;
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
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      return h(
        UAvatar,
        { src: row.getValue('logo'), size: 'xl' }
      )
    }
  },
  {
    accessorKey: 'name',
    header: `Publisher's name`,
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

function getActionItems(publisherId) {
  return [
    {
      label: 'Update information',
      to: `/admin/publishers/form?id=${publisherId}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        await deletePublisher(publisherId);
        const publisherCounts = await getTotalPublisherCounts();
        const newPage = getNewPage(page.value, publisherCounts, perPage);
        if (page.value !== newPage) {
          page.value = newPage;
          navigateTo(`/admin/publishers?page=${newPage}#with-links`);
        } else {
          refresh();
        }
      }
    }
  ]
}
</script>