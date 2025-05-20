<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      v-if="status === 'success'"
      :data="wishlist.reader?.data"
      :handle-upload-photo="handleUploadPhoto"
    />
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="1"
      :class-value="`w-1/3 h-55`"
    />
    <!-- Right: Information Details -->
    <div
      v-if="status === 'success'"
      class="w-2/3 p-6 flex flex-col justify-between"
    >
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ wishlist.reader?.data.name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ wishlist.reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Address:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ wishlist.reader?.data.address }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ useDateFormat(wishlist.reader?.data.created_at || '', 'MMMM Do, YYYY') }}</span>
            </div>
        </div>
    </div>
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="1"
      :class-value="`w-2/3 h-55`"
    />
  </div>
  <div class="p-4" v-if="status === 'success'">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Your wishlists: {{ wishlist.books.count }} books</h3>
  </div>
  <LoadingCard
    v-if="status === 'pending'"
    :quantity="1"
    :class-value="`w-full h-10`"
  />

  <div class="grid grid-cols-1 sm:grid-cols-5 gap-6">
    <BookCard
      v-if="status === 'success'"
      v-for="book in wishlist.books.data"
      :key="book.id"
      :book="book.books"
      :wishlistId="book.id"
      @refreshWishlists="refresh"
    />
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="5"
      :class-value="`w-full h-[340px]`"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { useRouteParams } from '@vueuse/router';

const { get, update } = useUsers();
const { index:getWishlist } = useWishlists();

const readerId = useRouteParams('id', null);

const columns = `
  id,book_id,
  books!inner(
    id,title,coverImage:cover_image,
    book_copies(*)
  )
`;
const { data:wishlist, error, refresh, status } = useAsyncData(
  `reader/${readerId.value}`,
  async() => {
    const [reader, books] = await Promise.all([
      get(readerId.value),
      getWishlist({ columns: columns, readerId: readerId.value })
    ]);

    return { reader, books}
  }
);

async function handleUploadPhoto(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    await update(readerId.value, { photo: file })
      .then(() => {
        useToastSuccess();
        window.location.reload();
      })
      .catch((error) => useToastError(error));
  }
};
</script>