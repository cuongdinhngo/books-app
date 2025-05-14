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

  <OrderStats
    :orders="reader.data?.orders"
    :route-name="'admin-orders'"
    :reader-id="readerId"
  />
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