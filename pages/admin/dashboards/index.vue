<template>
  <div class="flex flex-col h-full text-stone-900">
    <div class="flex-1 overflow-y-auto p-6">
      <!-- Dashboard Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Book Stats dashboard -->
        <div class="flex flex-col">
          <DashboardBookStats class="h-full" />
        </div>
        
        <!-- Top Borrowed Books dashboard -->
        <div class="flex flex-col">
          <DashboardBorrowedBook class="h-full" />
        </div>
        
        <!-- Top Rating Books dashboard -->
        <div class="flex flex-col">
          <DashboardRatingBook class="h-full" />
        </div>
        
        <!-- Top Borrowed Readers dashboard -->
        <div class="flex flex-col">
          <DashboardBorrowedReader class="h-full" />
        </div>

        <!-- Top Books via Category dashboard -->
        <div class="flex flex-col">
          <DashboardBookByCategory class="h-full" />
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DashboardBookStats } from '#components';

// Chart data and components will be imported and defined here
</script>