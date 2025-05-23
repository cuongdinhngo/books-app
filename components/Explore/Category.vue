<template>
  <div class="mb-6">
    <h3 class="text-stone-800 font-bold mb-1">
      Explore Categories
    </h3>
    <div v-if="status === 'success'" class="p-5 bg-primary-50">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        <ExploreItem
          v-for="item in displayedCategories"
          :key="item.id"
          :item="item"
          :type="'categories'"
          :heightItem="'h-[250px]'"
          :image-size="`w-full h-40`"
        />
      </div>
      
      <div v-if="hasMoreCategories" class="mt-4 text-center">
        <UButton 
          color="primary" 
          variant="soft" 
          @click="showMore"
        >
          Show More
        </UButton>
      </div>
    </div>
    
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="1"
      :class-value="`w-full h-[340px]`"
    />
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const { data:categories, error, status } = useAsyncData(
  `explore-categories-${route.name}`,
  () => useSupabaseClient().rpc('get_categories_with_top_rated_book')
);

// Show more functionality
const itemsPerPage = 10;
const currentPage = ref(1);

const displayedCategories = computed(() => {
  if (!categories.value?.data) return [];
  return categories.value.data.slice(0, currentPage.value * itemsPerPage);
});

const hasMoreCategories = computed(() => {
  if (!categories.value?.data) return false;
  return displayedCategories.value.length < categories.value.data.length;
});

function showMore() {
  currentPage.value++;
}
</script>