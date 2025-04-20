<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <FormInputDiv
      v-model="name"
      label-name="Name"
      placeholder="Search by name"
    />

    <FormInputDiv
      v-model="email"
      label-name="Email"
      placeholder="Search by email"
    />

    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
    </div>
  </form>

  <DataTable
    v-if="reader?.count > 0"
    :data="reader.data"
    :columns="columns"
  />
  <h3 v-else class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="reader?.count > 0"
    :totalCounts="reader.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup>
const { query } = useRoute();
const { index } = useReaders();
const email = ref('');
const name = ref('');
const pageSize = 5;
const page = ref(Number(query.page) || 1);
const searchParams = ref({
  columns: 'id, fullName:full_name, email',
  page: page.value,
  size: pageSize,
  email: email.value,
  fullName: name.value
});

const { data: reader, error, refresh } = await useAsyncData(
  `reader-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handlePageChange = (newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const handleSearch = async() => {
  searchParams.value = {
    columns: 'id, fullName:full_name, email',
    page: page.value,
    size: pageSize,
    email: email.value,
    fullName: name.value
  }

  refresh();
}

const columns = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/readers/${row.original.id}`,
          class: 'text-primary-500'
        },
        `#${row.getValue('id')}`
      )
    }
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/readers/${row.original.id}`,
          class: 'text-primary-500'
        },
        `${row.getValue('fullName')}`
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/readers/${row.original.id}`,
          class: 'text-primary-500'
        },
        `${row.getValue('email')}`
      )
    }
  },
]
</script>