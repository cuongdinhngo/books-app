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
    v-if="publisher?.count > 0"
    :totalCounts="publisher.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';

const { index, remove } = usePublishers();
const selectedPublishers = ref([]);
const page = ref(Number(useRoute().query?.page) || 1);
const pageSize = 5;
const searchParams = ref({
  ids: selectedPublishers.value,
  page: page.value,
  size: pageSize
});

const { data: publisher, error, refresh } = await useAsyncData(
  `publisher-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handleSearch = async() => {
  searchParams.value.page = 1;
  searchParams.value.ids = selectedPublishers.value;
  refresh();
}

const handlePageChange = async(newPage) => {
  searchParams.value.page = newPage;
  page.value = newPage;
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
        const { error } = await remove(Number(publisher.id));
        if (null === error) {
          const { count } = await index();
          if (count) {
            const newPage = getNewPage(page.value, count, pageSize);
            if (page.value !== newPage) {
              page.value = newPage;
              navigateTo(`/admin/publishers?page=${newPage}#with-links`);
            } else {
              refresh();
            }
          }
        }
      }
    }
  ]
}
</script>