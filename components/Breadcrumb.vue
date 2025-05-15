<template>
  <UBreadcrumb :items="breadcrumbItems">
    <template #dropdown="{ item }">
      <UDropdownMenu :items="item.children">
        <UButton :label="item.label" :icon="item.icon" color="neutral" variant="link" class="p-0.5" />
      </UDropdownMenu>
    </template>
  </UBreadcrumb>
</template>
<script setup lang="ts">
import { breadcrumbItems } from '~/composables/breadcrumbs';
</script>