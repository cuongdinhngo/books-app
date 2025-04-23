<template>
  <UTable
    v-if="data?.length > 0"
    :data="data"
    :columns="columns"
    class="flex-1"
  >
    <template #actions-cell="{ row }">
      <UDropdownMenu v-if="getDropdownActions !== null" :items="getDropdownActions(row.original)">
        <UButton
          icon="lucide:ellipsis-vertical"
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
        <UAvatar :src="row.original.coverImage" size="xl"/>
        <div>
          <p class="font-medium text-stone-800">{{ row.original.title}}</p>
        </div>
      </div>
    </template>

    <template #staffName-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="row.original.photo" size="xl" class="rounded-none"/>
        <div>
          <a :href="`/admin/staff/form?id=${row.original.id}`">
            <p class="font-medium text-primary-500">{{ row.original.fullName }}</p>
          </a>
        </div>
      </div>
    </template>

    <template #bookItemStatus-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="bookItemStatusColor[row.original.status]">
        {{ row.original.status }}
      </UBadge>
    </template>

    <template #bookItemStatusAction-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="bookItemStatusColor[row.original.status]">
        {{ row.original.status }}
      </UBadge>
    </template>

    <template #orderActions-cell="{ row }">
      <div class="flex space-x-4">
        <UButton
          icon="lucide:calendar-cog"
          size="md"
          color="primary"
          variant="subtle"
          @click="navigateTo(`/admin/orders/${row.original.id}`)"
        >
          View details
        </UButton>
        <UButton
          icon="lucide:badge-check"
          size="md"
          color="primary"
          variant="subtle"
          v-if="handleApprove !== null"
          @click="handleApprove(row.original.id)"
        >
          Approve
        </UButton>
      </div>
    </template>

    <template #cartActions-cell="{ row }">
      <UButton
          icon="lucide:trash-2"
          size="md"
          color="primary"
          variant="subtle"
          v-if="handleRemoveCartItem !== null"
          @click="handleRemoveCartItem(Number(row.original.id))"
        >
          Remove
        </UButton>
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
    type: [Function, null],
    default: null
  },
  handleApprove: {
    type: [Function, null],
    default: null
  },
  handleRemoveCartItem: {
    type: [Function, null],
    default: null
  }
});

const bookItemStatusColor = {
  open: 'success',
  pending: 'info',
  borrowed: 'warning',
  lost: 'neutral'
}
</script>