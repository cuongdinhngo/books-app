<template>
  <UBreadcrumb :items="items" class="mb-4"/>
</template>

<script setup>
const { getBreadcrumbs } = useRouters();
const breadcrumbs = getBreadcrumbs(useRoute().path);
const items = ref(breadcrumbs);
</script>