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
        :to="{ name: 'admin-publishers-create'}"
      />
    </div>
  </form>

  <DataTable
    v-if="publisher?.data"
    :data="publisher?.data"
    :columns="columns"
    edit-link="admin-publishers-id"
    :delete-item="deletePublisher"
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
import { useRouteQuery } from '@vueuse/router';
import DataTable from '~/components/DataTable.vue';

const { index, remove } = usePublishers();
const selectedPublishers = ref([]);
const page = ref(useRouteQuery('page', 1, {transform: Number}));
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

const deletePublisher = async(publisherId: number) => {
  const response = window.confirm('Are you sure to delete this publisher');
  if (!response) return;

  await remove(publisherId)
    .then(async({ error }) => {
      if (error) throw error;

      useToastSuccess();
      const { count } = await index();
      if (count) {
        const newPage = getNewPage(page.value, count, pageSize);
        if (page.value !== newPage) {
          useToastSuccess();
          navigateTo(`/admin/publishers?page=${newPage}#with-links`);
        } else {
          refresh();
        }
      }
    })
    .catch((error) => useToastError(error));
}

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
    id: 'crud-actions'
  }
]
</script>