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
    :data="publishers"
    :columns="columns"
  />

  <Pagination
    v-model="page"
    v-if="totalPublisherCounts > 0"
    :totalCounts="totalPublisherCounts"
    :items-per-page="perPage"
    @changePage="handlePageChange"
  />
</template>

<script setup>
import { FormCreateLink, FormSearchButton } from '#components';

const route = useRoute();
const { publishers, searchPublishers, totalPublisherCounts, perPage, getNewPage, deletePublisher} = usePublishers();
const selectedPublishers = ref([]);
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
    accessorKey: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      return h(UAvatar, { src: row.getValue('logo'), size: 'xl' })
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
      to: `/admin/publishers/form?id=${row.original.id}`,
    },
    {
      label: 'Delete',
      onSelect() {
        deletePublisher(row.original.id);
        const newPage = getNewPage(Number(route.query.page), totalPublisherCounts.value, perPage);
        navigateTo(`/admin/publishers?page=${newPage}#with-links`);
      }
    }
  ]
}

const handleSearch = async() => {
  await searchPublishers([...selectedPublishers.value]);
}

const handlePageChange = async(newPage) => {
  await searchPublishers(selectedPublishers.value, newPage);
};

onMounted(async() => {
  page.value = Number(route.query.page);
  await searchPublishers(selectedPublishers.value, Number(route.query.page) || 1);
});
</script>