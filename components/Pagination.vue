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

  siblingCount: {
    type: Number,
    default: 2
  }
});

const currentPage = defineModel({
  type: Number,
  default: () => {
    const route = useRoute();
    return Number(route.query.page) || 1;
  }
})

console.log(`[Pagination] totalCounts = ${props.totalCounts}, currentPagePage = ${props.modelValue}`);

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
