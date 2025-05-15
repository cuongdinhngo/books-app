<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <div class="flex-1 flex flex-col md:flex-row overflow-auto">
      <section class="flex-1 p-6 bg-blue-50 flex flex-col">
        <div class="mb-4">
          <UBreadcrumb :items="breadcrumbItems">
            <template #dropdown="{ item }">
              <UDropdownMenu :items="item.children">
                <UButton :label="item.label" :icon="item.icon" color="neutral" variant="link" class="p-0.5" />
              </UDropdownMenu>
            </template>
          </UBreadcrumb>
        </div>
        <div class="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { breadcrumbItems } from '~/composables/breadcrumbs';
</script>