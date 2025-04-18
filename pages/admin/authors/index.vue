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
    :get-dropdown-actions="getActionItems"
  />

  <Pagination
    v-model="page"
    v-if="author?.count > 0"
    :totalCounts="author.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';

const { query } = useRoute();
const {
  index,
  remove
} = useAuthors();
const selectedAuthors = ref([]);
const page = ref(Number(query?.page) || 1);
const pageSize = 5;
const searchParams = ref({
  ids: selectedAuthors.value,
  page: page.value,
  size: pageSize
});

const { data: author, error, refresh } = await useAsyncData(
  `author-page-${page.value}`,
  () => index(searchParams.value),
  {
    watch: [searchParams.value]
  }
)

const handleSearch = async() => {
  page.value = 1;
  searchParams.value = {
    ids: selectedAuthors.value,
    page: page.value,
    size: pageSize
  }
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
    accessorKey: 'photo',
    header: 'Profile',
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'birth_year',
    header: 'Birth Year',
    cell: ({ row }) => row.getValue('birth_year') ? row.getValue('birth_year') : '----'
  },
  {
    accessorKey: 'death_year',
    header: 'Death Year',
    cell: ({ row }) => row.getValue('death_year') ? row.getValue('death_year') : '----'
  },
  {
    header: 'Actions',
    id: 'actions'
  }
]

function getActionItems(author: Tables<'authors'>) {
  return [
    {
      label: 'Update information',
      to: `/admin/authors/form?id=${author.id}`,
    },
    {
      label: 'Delete',
      async onSelect() {
        const { error } = await remove(Number(author.id));
        if (null === error) {
          const { count } = await index();
          if (count) {
            const newPage = getNewPage(page.value, count, pageSize);
            if (page.value !== newPage) {
              page.value = newPage;
              navigateTo(`/admin/authors?page=${newPage}#with-links`);
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