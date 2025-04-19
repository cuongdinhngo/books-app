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

    <template #coverImage-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="row.original.coverImage" size="xl" />
        <div>
          <p class="font-medium text-stone-800">{{ row.original.title}}</p>
        </div>
      </div>
    </template>

    <template #bookItemStatus-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="bookItemStatusColor[row.original.status]">
        {{ row.original.status }}
      </UBadge>
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

const bookItemStatusColor = {
  open: 'success',
  pending: 'info',
  borrowed: 'warning',
  lost: 'neutral'
}
</script>