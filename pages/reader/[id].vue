<template>
  <div class="bg-white rounded-lg flex w-full">
    <!-- Left: Profile Photo -->
    <ProfilePhotoBlock
      :data="data.reader?.data"
      :handle-upload-photo="handleUploadPhoto"
    />
    <!-- Right: Information Details -->
    <div class="w-2/3 p-6 flex flex-col justify-between">
        <div class="space-y-4">
            <div>
                <span class="text-gray-600">Full Name:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.name }} </span>
            </div>
            <div>
                <span class="text-gray-600">Email:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.email }}</span>
            </div>
            <div>
                <span class="text-gray-600">Address:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.address }}</span>
            </div>
            <div>
                <span class="text-gray-600">Created At:</span>
                <span class="font-bold text-stone-900 ml-1"> {{ data.reader?.data.created_at ? readableDateTime(data.reader?.data.created_at) : null }}</span>
            </div>
        </div>
    </div>
  </div>
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">Your wishlists: {{ wishlists?.length }} books</h3>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <BookCard
      v-for="book in wishlists"
      :key="book.id"
      :book="book"
    />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { useRouteParams } from '@vueuse/router';
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';

const { get, update } = useUsers();
const { index } = useWishlists();
const { index:getBookCopies } = useBookCopies();

const readerId = useRouteParams('id');

const { data, error } = await useAsyncData(
  `reader/${readerId.value}`,
  async() => {
    const [reader, books] = await Promise.all([
      get(readerId.value),
      index({ columns: 'id,book_id,books(id,title,coverImage:cover_image)', readerId: readerId.value })
    ]);

    return { reader, books}
  }
);

const { data:wishlists, error:wishlistsError } = await useAsyncData(
  `reader-wishlists-${readerId.value}`,
  async() => {
    const ids = data?.value.books.data.map(item => item.book_id);
    let books = data?.value?.books.data?.map(item => {
      return {
        id: item.book_id,
        title: item.books.title,
        coverImage: item.books.coverImage,
        status: BOOK_COPY_STATUS.UNAVAILABLE
      }
    });

    const { data:bookItems, error } = await getBookCopies({ bookIds: ids, status: [BOOK_COPY_STATUS.OPENING]});
    if (error) {
      useToastError(error);
      return [];
    }

    if (bookItems?.length > 0) {
      books.forEach(book => {
        const availableBook = bookItems.find(ab => ab.book_id === book.id);
        if (availableBook && availableBook.status === BOOK_COPY_STATUS.OPENING) {
          book.status = BOOK_COPY_STATUS.AVAILABLE;
        }
      });
    }
    return books;
  }
);

const handleUploadPhoto = async(event) => {
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