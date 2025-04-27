<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="data.reader?.data"
      :handle-upload-photo="handleUploadPhoto"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.full_name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Birthday:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.birthday }}</span>
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

  <DataTable
    v-if="data.order.count > 0"
    :data="data.order.data"
    :columns="columns"
  />
  <h3 v-else class="text-violet-950 justify-center">No historical orders</h3>
</template>
<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';

const { get, update } = useReaders();
const { index } = useOrders();

const readerId = useRouteParams('id');

const handleUploadPhoto = async(event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    await update(readerId.value, { photo: file })
      .then(() => {
        useToastSuccess();
        refreshReder();
      })
      .catch((error) => useToastError(error));
  }
};

const {data, error, refresh} = await useAsyncData(
  `readers-${readerId.value}`,
  async() => {
    const [reader, order] = await Promise.all([
      get(readerId.value),
      index({ readerId: readerId.value, columns: 'id, status, created_at, order_items(count)' }) 
    ]);

    return { reader, order };
  }
);

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/orders/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        `#${row.getValue('id')}`
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/orders/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        capitalize(row.original.status)
      )
    }
  },
  {
    accessorKey: 'order_items',
    header: 'Quantity',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/orders/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        row.getValue('order_items')[0].count
      )
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Booked at',
    cell: ({ row }) => {
      return h(
        'a',
        {
          href: `/admin/orders/${row.getValue('id')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        readableDateTime(row.getValue('created_at'))
      )
    }
  },
]
</script>