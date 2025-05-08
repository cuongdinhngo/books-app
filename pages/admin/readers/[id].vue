<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="data.reader?.data"
      :handle-upload-photo="handleUploadPhoto"
      :open-modal="profileModal"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data?.name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Phone:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.phone }}</span>
            </div>
            <div>
                <span class="text-gray-600">Address:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.address }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.created_at ? readableDateTime(data.reader?.data.created_at) : null }}</span>
            </div>
        </div>
    </div>
  </div>

  <UTable
    v-if="data.order.count > 0"
    :data="data.order.data"
    class="flex-1"
    :columns="[
      {
        accessorKey: 'id',
        header: '#'
      },
      {
        accessorKey: 'status',
        header: 'Status'
      },
      {
        accessorKey: 'created_at',
        header: 'Booked at',
        id: 'bookedAt'
      }
    ]"
  >
    <template #id-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.id }}" class="font-medium text-primary-500">
        #{{ row.original.id }}
      </NuxtLink>
    </template>

    <template #status-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.id }}" class="font-medium text-primary-500">
        {{ capitalize(row.original.status) }}
      </NuxtLink>
    </template>

    <template #bookedAt-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-orders-id', params: { id: row.original.id }}" class="font-medium text-primary-500">
        {{ useDateFormat(row.original.created_at, 'MMMM Do, YYYY') }}
      </NuxtLink>
    </template>

  </UTable>
  <h3 v-else class="text-violet-950 justify-center">No historical orders</h3>
</template>
<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';

const { get, update } = useUsers();
const { index } = useOrders();

const readerId = useRouteParams('id');
const profileModal = ref(false);

const handleUploadPhoto = async(event) => {
  const file = event.target.files[0];
  console.log('handle-upload-photo => ', readerId.value, file);
  if (file && file.type.startsWith("image/")) {
    await update(readerId.value, { photo: file })
      .then(({ error }) => {
        if (error) throw error;

        profileModal.value = false;
        useToastSuccess();
        refresh();
      })
      .catch((error) => useToastError(error));
  }
};

const {data, error, refresh} = await useAsyncData(
  `readers-${readerId.value}`,
  async() => {
    const [reader, order] = await Promise.all([
      get(readerId.value),
      index({ readerId: readerId.value, columns: 'id, status, created_at' })
    ]);

    return { reader, order };
  }
);

if (error.value) {
  useToastError(error.value);
}
</script>