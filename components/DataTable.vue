<template>
  <UTable
    v-if="data?.length > 0"
    :data="data"
    :columns="columns"
    class="flex-1"
  />
</template>

<script setup>
const props = defineProps({
  data: Object,
  columns: Object
});
</script>