<template>
  <div>
    {{ data?.data }}
    <UButton @click="onRemove()">Remove</UButton>
  </div>
</template>

<script lang="ts" setup>

const { get } = useTest()
const { params } = useRoute()
const { data, status } = useAsyncData(`category-${params.id}`, () => get(params.id.toString()))
const toast = useToast()

function onRemove() {
  const result = window.confirm('Are you sure you want to remove this category?')
  if (!result) {
    return
  }
  return useTest().remove(params.id.toString())
    .then(() => useRouter().replace('/test'))
    .catch(useToastError)
}
</script>

<style></style>
