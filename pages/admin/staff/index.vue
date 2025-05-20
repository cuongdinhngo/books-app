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
          @click="searchUsers"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
        <UButton
          :to="{ name: 'admin-staff-form' }"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Create New
        </UButton>
      </div>
    </div>
  </div>

  <UTable
    v-if="status === 'success'"
    :data="staff.data"
    :columns="columns"
    class="flex-1"
  >
    <template #staffName-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="row.original.photo" size="xl" class="rounded-none"/>
        <div>
          <NuxtLink :to="{ name: 'admin-staff-id', params: { id: row.original.id }}">
            <p class="font-medium text-primary-500">{{ row.original.name }}</p>
          </NuxtLink>
        </div>
      </div>
    </template>

    <template #staffEmail-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-staff-id', params: { id: row.original.id }}" class="font-medium text-primary-500">
        {{ row.original.email }}
      </NuxtLink>
    </template>
  </UTable>
  <LoadingProcess
    v-if="status === 'pending'"
  />
  <h3 v-if="staff?.count == 0" class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="staff?.count > 0"
    :totalCounts="staff.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup>
import { useRouteQuery } from '@vueuse/router';
import { USER_ROLE_STAFF } from '~/constants/users';

const { index } = useUsers();

const email = ref('');
const name = ref('');
const pageSize = 5;
const page = useRouteQuery('page', '1', { transform: Number });
const searchParams = ref({
  columns: 'id, name, email, photo',
  page: page.value,
  size: pageSize,
  email: email.value,
  name: name.value,
  role: USER_ROLE_STAFF
});

const { data: staff, error, refresh, status } = useAsyncData(
  `staff-page-${page.value}`,
  () => index(searchParams.value),
  { watch: [searchParams.value] }
);

const handlePageChange = (newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

const searchUsers = async() => {
  searchParams.value.email = email.value;
  searchParams.value.name = name.value;
  searchParams.value.page = 1;
}

const columns = [
  {
    accessorKey: 'name',
    header: 'Full name',
    id: 'staffName'
  },
  {
    accessorKey: 'email',
    header: 'Email',
    id: 'staffEmail'
  },
]
</script>