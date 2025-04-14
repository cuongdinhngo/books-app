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

  <div v-if="isLoading" class="text-center text-stone-950">Loading ...</div>

  <DataTable
    v-if="readers?.length > 0"
    :data="readers"
    :columns="columns"
  />
  <h3 v-else class="justify-center flex text-stone-900">No Data</h3>
</template>

<script setup>
const UButton = resolveComponent('UButton')
const columns = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
    cell: ({ row }) => `${row.getValue('fullName')}`
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => `${row.getValue('email')}`
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      return h(
        UButton,
        {
          label: 'View detail',
          color: 'primary',
          variant: 'subtle',
          class: 'ml-auto',
          onClick: () => navigateTo(`/admin/readers/${row.original.id}`)
        }
      )
    }
  }
]
function getActionItems(row) {
  return [
    {
      label: 'View details',
      to: `/admin/readers/${row.original.id}`,
    },
    {
      label: 'Delete',
      onSelect() {
        // delete
      }
    }
  ]
}

const { readers, searchReaders, isLoading } = useReaders();
const email = ref('');
const name = ref('');

const handleSearch = async() => {
  let searchTerm = {};
  if (name.value) {
    searchTerm.name = name.value;
  }
  if (email.value) {
    searchTerm.email = email.value;
  }
  await searchReaders(searchTerm);
}

onMounted(async() => {
  await searchReaders();
});
</script>