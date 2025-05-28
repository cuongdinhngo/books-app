<template>
  <div class="mt-6 flex flex-col items-center gap-4" id="with-links">
    <p class="text-stone-800 self-start" v-if="enableTotalCounts">
      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalCounts) }} of {{ totalCounts }} items
    </p>
    <UPagination
      v-if="totalCounts > 0"
      v-model="currentPage"
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
    type: [Number, null],
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
  },
  enableTotalCounts: {
    type: Boolean,
    default: true
  }
});
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
  const currentQuery = useRoute().query;
  return {
    query: {...currentQuery, page: page },
    hash: '#with-links'
  };
};

const handlePageUpdate = (newPage) => {
  emit('update:page', newPage);
  emit('changePage', newPage);
};
</script>