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
    :get-dropdown-actions="getActionItems"
  />

  <Pagination
    v-model="page"
    v-if="publisher?.counts > 0"
    :totalCounts="publisher.counts"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';

const {
  deletePublisher,
  getTotalPublisherCounts,
  getPublishers
} = usePublishers();
const selectedPublishers = ref([]);
const page = ref(1);
const searchParams = ref({
  publishers: selectedPublishers.value,
  page: page.value
});
const pageSize = 5;

const { data: publisher, refresh } = await useAsyncData(
  `publisher-page:${page.value}`,
  async() => {
    const searchConditions = {
      selectColumns: 'id, name, logo',
      filterIds: searchParams.value.publishers,
      page: searchParams.value.page,
      pageSize
    };
    const data = await getPublishers(searchConditions);
    const counts = await getTotalPublisherCounts({ filterIds: searchParams.value.publishers });
    console.log(`useAsyncData => publisher-page:${page.value} && COUNTS: ${counts}`);

    return { data, counts }
  }, {
    watch: [searchParams.value]
  }
)

const handleSearch = async() => {
  searchParams.value.page = 1;
  searchParams.value.publishers = selectedPublishers.value;
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
};

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'logo',
    header: 'Logo'
  },
  {
    accessorKey: 'name',
    header: `Publisher's name`,
  },
  {
    header: 'Actions',
    id: 'actions'
  }
]

function getActionItems(publisher: Tables<'publishers'>) {
  return [
    {
      label: 'Update information',
      to: `/admin/publishers/form?id=${publisher.id}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        await deletePublisher(publisher.id);
        const publisherCounts = await getTotalPublisherCounts({ filterIds: selectedPublishers.value });
        const newPage = getNewPage(page.value, publisherCounts, pageSize);
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