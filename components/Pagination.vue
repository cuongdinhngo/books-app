<template>
  <div class="mt-6 flex justify-center space-x-2 text-stone-950" id="with-links">
    <UPagination
      v-if="totalCounts > 0"
      v-model="currentPage"
      show-edges
      :sibling-count="siblingCount"
      :items-per-page="itemsPerPage"
      :total="totalCounts"
      :to="toPage"
      @update:page="handlePageUpdate"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  totalCounts: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  modelValue: {
    type: Number,
    default: 1
  },
  siblingCount: {
    type: Number,
    default: 2
  }
});

console.log(`[Pagination] totalCounts = ${props.totalCounts}, currentPage = ${props.modelValue}`);

const emit = defineEmits(['update:page', 'changePage']);

const currentPage = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:page', value);
  }
});

const toPage = (page) => {
  return {
    query: { page },
    hash: '#with-links'
  };
};

const handlePageUpdate = (newPage) => {
  emit('update:page', newPage);
  emit('changePage', newPage);
};
</script>