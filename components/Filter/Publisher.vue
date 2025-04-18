<template>
  <USelectMenu
    v-model="publishers"
    :items="items"
    :multiple="multiple"
    value-key="id"
    variant="none"
    placeholder="Select publishers"
    class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
</template>

<script setup>
const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
});
const { index } = usePublishers();
const publishers = defineModel();
const items = ref([]);

onMounted(async() => {
  const { data, error } = await index({ columns: 'id, label:name' });
  items.value = data;
});
</script>