<template>
  <UCard>
    <template #header>
      <UInput v-model="state.search" placeholder="Search books" />
    </template>
    
      <ul>
        <template v-for="book in data.data" :key="book.id">
          <li>{{ book.title }}</li>
        </template>
      </ul>
    
  </UCard>
</template>

<script lang="ts" setup>
import type { Database } from "@/types"

const client = useSupabaseClient<Database>()
const state = reactive({
  search: '',
})

const { data } = useAsyncData('books', async () => client.from('books').select('*', { count: 'exact' }).order('created_at', { ascending: false }),{
  default: () => ({
    data: [],
    count: 0,
  }),
  transform: ({data, count}) => {
    console.log(data);
    
    return {
      data,
      count
    }
  },
})



</script>

<style></style>
