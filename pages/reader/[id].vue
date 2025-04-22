<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="reader?.data"
      :handle-upload-photo="handleUploadPhoto"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.full_name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Birthday:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.birthday }}</span>
            </div>
            <div>
                <span class="text-gray-600">Address:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.address }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ reader?.data.created_at ? readableDateTime(reader?.data.created_at) : null }}</span>
            </div>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { useRouteParams } from '@vueuse/router';
const { get, update } = useReaders();
const readerId = useRouteParams('id');

const { data:reader, error } = await useAsyncData(
  `reader-${readerId.value}`,
  () => get(readerId.value)
);

const handleUploadPhoto = async(event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    await update(readerId.value, { photo: file })
      .then(() => {
        useToastSuccess();
        window.location.reload();
      })
      .catch((error) => useToastError(error));
  }
};
</script>