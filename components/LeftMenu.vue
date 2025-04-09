<template>
  <aside class="bg-gray-800 text-white w-full md:w-64 p-4 h-auto md:h-screen">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      variant="pill"
      highlight
      highlight-color="red"
      class="data-[orientation=vertical]:w-48"
    />
  </aside>
</template>

<script setup>
const { getRouteByName } = useRouters();
const items = ref([[getRouteByName('books')]]);
</script>