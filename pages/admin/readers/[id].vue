<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="reader?.data"
      :handle-upload-photo="handleUploadPhoto"
      :open-modal="profileModal"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data?.name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Phone:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.phone }}</span>
            </div>
            <div>
                <span class="text-gray-600">Address:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.address }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ useDateFormat(reader?.data.created_at || '', 'MMMM Do, YYYY') }}</span>
            </div>
        </div>
    </div>
  </div>

  <!-- Order Statistics -->
  <div class="grid grid-cols-6 gap-2 my-4">
    <NuxtLink
      :to="{ name: 'admin-orders', query: { readerId: readerId } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-blue-200 rounded-2xl cursor-pointer"
    >
      Total: {{ orders?.total || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: 'admin-orders', query: { status: [ ORDER_STATUS.WAITING ] } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-violet-300 rounded-2xl cursor-pointer"
    >
      Waiting: {{ orders?.waiting || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: 'admin-orders', query: { status: [ ORDER_STATUS.BORROWING ] } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-green-200 rounded-2xl cursor-pointer"
    >
      Borrowing: {{ orders?.borrowing || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: 'admin-orders', query: { status: [ ORDER_STATUS.CLOSE ] } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-orange-200 rounded-2xl cursor-pointer"
    >
      Closed: {{ orders?.closed || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: 'admin-orders', query: { status: [ ORDER_STATUS.REJECT ] } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-pink-200 rounded-2xl cursor-pointer"
    >
      Rejected: {{ orders?.rejected || 0 }}
    </NuxtLink>

    <NuxtLink
      :to="{ name: 'admin-orders', query: { status: [ ORDER_STATUS.LOST ] } }"
      class="w-30 text-sm font-medium text-gray-700 p-2 bg-gray-300 rounded-2xl cursor-pointer"
    >
      Lost: {{ orders?.lost || 0 }}
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';
import { ORDER_STATUS } from '~/constants/orders';

const { update, index } = useUsers();

const readerId = useRouteParams('id');
const profileModal = ref(false);
const page = ref(useRouteQuery('page', 1, { transform: Number }));
const columns = `
  *,
  orders(
    *,
    books(*)
  )
`;
const searchParams = ref({
  columns,
  id: readerId.value
});


const {data:reader, error, refresh } = await useAsyncData(
  `readers/${readerId.value}/page/${page.value}`,
  () => index({ ...searchParams.value }).single(),
  { watch: [ searchParams.value ] }
); 

if (error.value) {
  useToastError(error.value);
}

const orders = computed(() => {
  const items = reader.value?.data?.orders.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const total = Number(items.waiting || 0) +
    Number(items.borrowing || 0) +
    Number(items.closed || 0) +
    Number(items.lost || 0) +
    Number(items.rejected || 0)
  ;

  return {
    total,
    waiting: items.waiting || 0,
    borrowing: items.borrowing || 0,
    closed: items.closed || 0,
    rejected: items.rejected || 0,
    lost: items.lost || 0
  };
});

async function handleUploadPhoto(event: Event) {
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

</script>