<template>
  <UTable
    v-if="data?.length > 0"
    :data="data"
    :columns="columns"
    class="flex-1"
  >
    <template #actions-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
          class="text-stone-950"
        />
      </UDropdownMenu>
    </template>

    <template #logo-cell="{ row }">
      <UAvatar :src="row.original.logo" size="xl" />
    </template>

    <template #photo-cell="{ row }">
      <UAvatar :src="row.original.photo" size="xl" />
    </template>
  </UTable>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  columns: {
    type: Object,
    required: true
  },
  getDropdownActions: {
    type: Function,
    required: true
  }
});
</script>