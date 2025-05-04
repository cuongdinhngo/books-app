<template>
  <div>
    <div v-if="status==='pending'">Loading...</div>
    <template v-for="book in data?.data" :key="book.id">
      <UCard :title="book.title">        
        <img v-if="book.cover_image" :src="book.cover_image" :alt="book.title" >
        <p>{{ book.description }}</p>
      </UCard>      
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Database } from '~/types'
const client = useSupabaseClient<Database>()

const { data, status, refresh } = useAsyncData('books', async () => client.from('books').select('*'))


</script>

<style></style>
