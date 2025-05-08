<template>
  <div class="mb-6 space-y-4 w-1/2 mx-auto">
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div class="flex-1">
          <label for="email" class="block text-sm font-medium text-gray-800 mb-1">Email</label>
          <input
            v-model="email"
            type="email" id="email" name="email" placeholder="Enter email"
            class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-800"
          />
        </div>
        <div class="flex-1">
          <label for="name" class="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            v-model="name"
            type="text" id="name" name="name" placeholder="Enter name"
            class="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-800"
          />
        </div>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </div>
  </div>

  <UTable
    v-if="reader?.count > 0"
    :data="reader.data"
    :columns="columns"
    class="flex-1"
  >
    <template #readerName-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="row.original.photo" size="xl" class="rounded-none"/>
        <div>
          <NuxtLink :to="{ name: 'admin-readers-id', params: { id: row.original.id }}">
            <p class="font-medium text-primary-500">{{ row.original.fullName }}</p>
          </NuxtLink>
        </div>
      </div>
    </template>

    <template #readerEmail-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-readers-id', params: { id: row.original.id }}" class="font-medium text-primary-500">
        {{ row.original.email }}
      </NuxtLink>
    </template>
  </UTable>
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
const { index } = useUsers();

const email = ref('');
const name = ref('');
const pageSize = 10;
const page = ref(Number(query.page) || 1);
const searchParams = ref({
  columns: 'id, name, email, photo',
  page: page.value,
  size: pageSize,
  email: email.value,
  name: name.value
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
  searchParams.value.page = 1;
  searchParams.value.name = name.value;
  searchParams.value.email = email.value;
}

const columns = [
  {
    accessorKey: 'fullName',
    header: 'Full name',
    id: 'readerName'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    id: 'readerEmail'
  },
]
</script>