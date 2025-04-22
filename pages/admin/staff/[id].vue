<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="staff?.data"
      :handle-upload-photo="handleUploadPhoto"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ staff?.data.full_name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ staff?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ staff?.data.created_at ? readableDateTime(staff?.data.created_at) : null }}</span>
            </div>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouteParams } from '@vueuse/router';
const { get, update } = useStaff();
const staffId = useRouteParams('id');

const { data:staff, error } = await useAsyncData(
  `staff-${staffId.value}`,
  () => get(staffId.value)
);

const handleUploadPhoto = async(event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    await update(staffId.value, { photo: file })
      .then(() => {
        useToastSuccess();
        window.location.reload();
      })
      .catch((error) => useToastError(error));
  }
}
</script>