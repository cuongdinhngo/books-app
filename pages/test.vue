<template>
  <div>
    <template v-for="category in data?.data">
      <UButton :to="`/categories/${category.id}`">{{ category.name }}</UButton>
    </template>    
  </div>
</template>

<script lang="ts" setup>

const { index } = useTest()
const { data } = useAsyncData('categories', () => index())
</script>

<style></style>
