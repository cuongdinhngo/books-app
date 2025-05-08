<template>
  <UTable
    v-if="data?.length > 0"
    :data="data"
    :columns="columns"
    class="flex-1"
  >
    <template #crud-actions-cell="{ row }">
      <div class="flex space-x-4">
        <UButton
          icon="lucide:clipboard-pen-line"
          size="md"
          color="primary"
          variant="subtle"
          v-if="editLink"
          :to="{ name: editLink, params: { id: row.original.id}}"
        >
          Edit
        </UButton>
        <UButton
          icon="lucide:trash-2"
          size="md"
          color="primary"
          variant="subtle"
          v-if="deleteItem"
          @click="deleteItem(Number(row.original.id))"
        >
          Delete
        </UButton>
      </div>
    </template>

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
      <UAvatar :src="row.original.logo" size="xl" class="rounded-none"/>
    </template>

    <template #photo-cell="{ row }">
      <UAvatar :src="row.original.photo" size="xl" />
    </template>

    <template #coverImage-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-books-id', params: { id: row.original.id }}">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.original.coverImage" size="xl" class="rounded-none"/>
          <div>
            <p class="font-medium text-stone-800">{{ row.original.title}}</p>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #author-cell="{ row }">
      <NuxtLink :to="{ name: 'admin-authors-id', params: { id: row.original.id}}">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.original.photo" size="xl" class="rounded-none"/>
          <div>
            <p class="font-medium text-stone-800">{{ row.original.full_name}}</p>
          </div>
        </div>
      </NuxtLink>
    </template>

    <template #readerName-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar :src="row.original.photo" size="xl" class="rounded-none"/>
        <div>
          <NuxtLink :to="{ name: 'admin-readers', params: { id: row.original.id }}">
            <p class="font-medium text-primary-500">{{ row.original.fullName }}</p>
          </NuxtLink>
        </div>
      </div>
    </template>

    <template #orderItemStatus-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="orderItemStatusColor[row.original.orderItemStatus]">
        {{ row.original.orderItemStatus }}
      </UBadge>
    </template>

    <template #bookItemStatus-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="bookItemStatusColor[row.original.orderItemStatus]">
        {{ transformOrderItemStatus(row.original) }}
      </UBadge>
    </template>

    <template #bookItemStatusAction-cell="{ row }">
      <UBadge class="capitalize" variant="subtle" :color="orderItemStatusColor[row.original.status]">
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
          :to="router.replace({name: 'admin-orders', params: { id: row.original.id }})"
        >
          View details
        </UButton>
        <UButton
          icon="lucide:badge-check"
          size="md"
          color="primary"
          variant="subtle"
          v-if="handleApprove !== null && row.original.status === ORDER_STATUS.WAITING"
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

    <template #adminOrderActions-cell="{ row }">
      <UModal
        title="Are you sure to delete this item?"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full'
        }"
      >
        <UButton
          icon="lucide:trash-2"
          label="Remove"
          size="md"
          color="primary"
          variant="subtle"
          v-if="row.original.orderStatus === ORDER_STATUS.WAITING"
        />
        <template #body>
          <div class="flex flex-col">
            <UTextarea placeholder="Type something..." class="w-full mb-5" v-model="itemComment"/>
            <UButton
              icon="lucide:badge-check"
              label="Submit"
              size="md"
              color="primary"
              variant="subtle"
              class="text-right"
              v-if="removeUnavailableBook !== null"
              @click="removeUnavailableBook(row.original.orderItemId)"
            />
          </div>
        </template>
      </UModal>

      <UBadge
        v-if="[ORDER_STATUS.CLOSE, ORDER_STATUS.REJECT].includes(row.original.orderStatus) || row.original.bookItemStatus === BOOK_COPY_STATUS.LOST"
        class="capitalize"
        variant="subtle"
        color="neutral"
      >
        Done
      </UBadge>

      <UModal
        title="Is this book lost?"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full'
        }"
      >
        <UButton
          icon="lucide:circle-x"
          label="Lost"
          size="md"
          color="primary"
          variant="subtle"
          v-if="row.original.orderStatus === ORDER_STATUS.BORROWING && row.original.bookItemStatus === ORDER_STATUS.BORROWING"
        />
        <template #body>
          <div class="flex flex-col">
            <UTextarea placeholder="Type something..." class="w-full mb-5" v-model="itemComment"/>
            <UButton
              icon="lucide:badge-check"
              label="Submit"
              size="md"
              color="primary"
              variant="subtle"
              class="text-right"
              v-if="markLostBook !== null"
              @click="markLostBook(row.original.uId)"
            />
          </div>
        </template>
      </UModal>
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
  detailLink: {
    type: String,
    default: null
  },
  editLink: {
    type: String,
    default: null
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
  },
  deleteItem: {
    type: [Function, null],
    default: null
  },
  removeUnavailableBook: {
    type: [Function, null],
    default: null
  },
  markLostBook: {
    type: [Function, null],
    default: null
  }
});

const router = useRouter();

const itemComment = defineModel({
  type: String,
  default: null
});

const orderItemStatusColor = {
  openning: 'success',
  pending: 'info',
  borrowed: 'warning',
  lost: 'neutral',
  closed: 'neutral',
  rejected: 'neutral',
}

const bookItemStatusColor = {
  opening: 'success',
  pending: 'warning',
  borrowed: 'warning',
  lost: 'warning',
  rejected: 'neutral',
  closed: 'neutral',
}

function transformOrderItemStatus(data) {
  let status = '';
  if (data.orderStatus === ORDER_STATUS.CLOSE || data.orderStatus === ORDER_STATUS.REJECT) {
    return data.orderStatus;
  }

  if (
    data.bookItemStatus ===  BOOK_STATUS.OPENING &&
    data.orderStatus !== ORDER_STATUS.CLOSE
  ) {
    status = 'Available';
  } else if (data.bookItemStatus ===  BOOK_COPY_STATUS.BORROWING) {
    status = BOOK_COPY_STATUS.BORROWING;
  } else if (data.bookItemStatus ===  BOOK_COPY_STATUS.LOST) {
    status = BOOK_COPY_STATUS.LOST;
  } else {
    status = data.orderItemStatus;
  }

  return status;
}
</script>