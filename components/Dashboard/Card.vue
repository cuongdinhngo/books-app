<template>
  <UCard class="h-full text-primary-50">
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <div class="flex items-center gap-3">
          <USelect 
            v-model="status" 
            value-key="id"
            :items="statusOptions" 
            class="w-48"
            @update:model-value="handleStatusChange"
          />
          <USelect
            v-model="size"
            :items="PAGE_SIZE_OPTIONS"
            class="w-24"
            placeholder="Size"
            @update:model-value="handleSizeChange"
          />
        </div>
      </div>
    </template>
    <div class="h-80">
      <div class="flex items-center justify-center h-full bg-gray-100 rounded">
        <!-- DataTable/Chart content here -->
        <slot />
        <LoadingProcess v-if="loadingStatus === 'pending'"/>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center w-full" v-if="loadingStatus === 'success'">
        <p class="text-sm text-stone-100">
          Showing {{ (page - 1) * size + 1 }} to {{ Math.min(page * size, totalCount) }} of {{ totalCount }} entries
        </p>
        <UPagination
          v-model:page="page"
          :total="totalCount"
          :items-per-page="size"
          :sibling-count="2"
        />
      </div>
    </template>
  </UCard>
</template>
<script lang="ts" setup>
import { PAGE_SIZE_OPTIONS } from '~/constants/common';

const props = defineProps({
  title: {
    type: String,
    default: 'Statistics Dashboard'
  },
  totalCount: {
    type: Number || null,
    required: true
  },
  loadingStatus: {
    type: String,
    default: 'pending'
  },
  statusOptions: {
    type: Array<{ id: string; label: string }>,
  }
});

const size = defineModel('size', {
  type: Number,
  default: PAGE_SIZE_OPTIONS[0].value
});

const page = defineModel('page', {
  type: Number,
  default: 1
});

const status = defineModel('status', {
  type: String,
  default: ''
});

function handleSizeChange() {
  page.value = 1;
}

function handleStatusChange() {
  page.value = 1;
}
</script>