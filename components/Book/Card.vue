<template>
  <div class="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full relative group">
    <UButton
      icon="lucide:x"
      size="md"
      color="primary"
      variant="solid"
      class="absolute top-2 right-2 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      @click="removeFromWishlist"
      ></UButton>
    <NuxtLink :to="`/book/${book.id}`">
      <img
        :src="book.coverImage"
        alt="Book Cover"
        class="w-full h-64 object-contain rounded-md mb-4"
      >
    </NuxtLink>
    <div class="flex flex-col">
      <h2 class="text-lg font-semibold text-gray-800 truncate">{{ book.title }}</h2>
      <p class="text-sm text-gray-600 text-right capitalize">Status: {{ isAvailable }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';

const props = defineProps({
  wishlistId: {
    type: Number,
    required: true
  },
  book: {
    type: Object,
    required: true
  }
});

const { remove } = useWishlists();
const emit = defineEmits(['refreshWishlists']);

const isAvailable = computed(() => {
  return props.book.book_copies.filter((copy) => {
    return copy.status === BOOK_COPY_STATUS.OPENING;
  }).length > 0 ? BOOK_COPY_STATUS.AVAILABLE : BOOK_COPY_STATUS.UNAVAILABLE;
});

async function removeFromWishlist() {
  const result = window.confirm('Are you sure you want to remove this book from your wishlist?');
  if (!result) return;

  await remove(props.wishlistId)
    .then(({ error }) => {
      if (error) throw error;

      emit('refreshWishlists');
      useToastSuccess('Book removed from wishlist successfully');
    })
    .catch((error) => useToastError(error));
};
</script>