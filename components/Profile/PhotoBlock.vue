<template>
  <div class="w-1/3">
    <img v-if="data?.photo" :src="data?.photo" alt="Profile Photo" class="object-contain rounded-lg w-100 h-55">
    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
      <UModal
        title="Upload profile photo"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full'
        }"
      >
        <UButton icon="lucide:image-plus" label="Upload photo" color="neutral" variant="subtle" />
        <template #body>
          <UInput type="file" v-if="handleUploadPhoto !== null" @change="handleUploadPhoto"/>
        </template>
      </UModal>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  data: {
    type: [Object, null],
  },
  handleUploadPhoto: {
    type: [Function, null],
    default: null
  }
});
</script>