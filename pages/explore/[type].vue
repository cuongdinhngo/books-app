<template>
  <div class="flex flex-col min-h-[calc(100vh-120px)]">
    <div class="flex-grow">
      <h3 class="text-stone-800 font-bold my-1">
        All {{ capitalize(type) }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 my-5">
        <ExploreItem
          v-if="status === 'success'"
          v-for="item in data.data"
          :key="item.id"
          :item="item"
          :type="type"
        />
        <LoadingCard
          v-if="status === 'pending'"
          :quantity="14"
          :class-value="`w-full h-[270px]`"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useRouteParams } from '@vueuse/router';

const type = useRouteParams('type', null);
const { index:getPublishers } = usePublishers();
const { index:getAuthors } = useAuthors();

const { data, error, status } = await useAsyncData(
  `books-${type.value}`,
  () => {
    if (type.value === 'categories') {
      return useSupabaseClient().rpc('get_categories_with_top_rated_book');
    }
    if (type.value === 'authors') {
      return getAuthors({ columns: 'id, name:full_name, photo' });
    }
    if (type.value === 'publishers') {
      return getPublishers({ columns: 'id, name, photo:logo' });
    }
  }
);
</script>