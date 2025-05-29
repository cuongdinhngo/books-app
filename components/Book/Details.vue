<template>
  <div class="p-3">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Side: Book Info -->
        <div class="space-y-4">
          <FormInputDiv
            v-model="title"
            label-name="Title"
            placeholder="Enter book's titlte"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700">Publisher</label>
            <FilterPublisher
              v-model="selectedPublishers"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <FilterCategory
              v-model="selectedCategories"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Author</label>
            <FilterAuthor
              v-model="selectedAuthors"
            />
          </div>

          <FormInputDiv
            label-name="Book cover photo"
            placeholder="Cover photo"
            type="file"
            :multiple="true"
            @change="handleFileUpload"
          />

          <!-- Book Preview upload-->
          <div>
            <label class="block text-sm font-medium text-gray-700">Book preview</label>
            <div class="flex w-full justify-between items-center">
              <input
                class="text-sm w-2/3 border p-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-stone-900 mr-2"
                placeholder="Book preview pdf"
                type="file"
                @change="handlePreviewUpload"
              >
              <UButton
                v-if="bookPreview"
                label="Preview"
                icon="lucide:book-open"
                color="primary"
                variant="subtle"
                @click="previewModal = !previewModal"
              />
              <UModal v-model:open="previewModal" title="Modal fullscreen">
                <template #content>
                  <iframe
                    :src="bookPreview"
                    class="w-[900px] h-[800px] border-none"
                  ></iframe>
                </template>
              </UModal>
            </div>
          </div>

        </div>

        <!-- Right Side: Book Cover -->
        <div class="flex items-center justify-center">
          <div class="w-full">
            <UCarousel
              ref="carousel"
              v-slot="{ item }"
              arrows
              :items="bookPhotos"
              :prev="{ onClick: onClickPrev }"
              :next="{ onClick: onClickNext }"
              class="w-[170px] mx-auto flex flex-col justify-center items-center"
              @select="onSelect"
            >
              <div class="relative">
                <img :src="item" width="170" height="170" class="rounded-lg object-contain">
                <UButton
                  type="button"
                  icon="lucide:trash-2"
                  color="primary"
                  variant="solid"
                  class="absolute bottom-2 right-2 z-10"
                  @click="removePhoto(item)"
                />
                <UButton
                  :disabled="item === primaryPhoto"
                  type="button"
                  icon="lucide:star"
                  :color="item === primaryPhoto ? 'warning' : 'primary'"
                  variant="solid"
                  class="absolute bottom-2 left-2 z-10"
                  @click="starPhoto(item)"
                />
              </div>
            </UCarousel>

            <div class="flex gap-2 justify-center pt-4 items-center">
              <div
                v-for="(item, index) in bookPhotos"
                :key="index"
                class="size-11 opacity-25 hover:opacity-100 transition-opacity"
                :class="{ 'opacity-100': activeIndex === index }"
                @click="select(index)"
              >
                <img :src="item" width="44" height="44" class="rounded-lg">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-6">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <BookEditor v-model:description="description"/>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="w-full md:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';
import { useRouteParams } from '@vueuse/router';
import { BOOK_STATUS } from '~/composables/books';

const { get, update } = useBooks();
const { insert:insertBooksAuthors, remove:deleteBooksAuthors } = useBooksAuthors();
const { insert:insertBooksCategories, remove:deleteBooksCategories } = useBooksCategories();
const { insert:insertBooksPublishers, remove:deleteBooksPublishers } = useBooksPublishers();
const { insert:insertBooksItems, remove:deleteBookItems, index:getBookItems } = useBookCopies();
const { remove:deleteBookPhoto, insert:insertBookPhotos } = useBookPhotos();

const bookId = useRouteParams('id', null, { transform: Number });

const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const selectedPhotos = ref(null);
const imagePreview = ref('');
const quantity = ref(0);
const description = ref('');
const oldQuantity = ref(0);
const oldAuthors = ref([]);
const oldCategories = ref([]);
const oldPublishers = ref([]);
const bookItems = ref([]);
const selectedPreview = ref(null);
const previewModal = ref(false);
const bookPreview = ref('');

const { data:book, error, refresh } = await useAsyncData(
  `book-${bookId.value}`,
  () => get(bookId.value)
);

if (error.value) {
  useToastError(error.value);
}

title.value = book.value.data.title;
description.value = book.value.data.description;
quantity.value = book.value.data.quantity;
selectedPhotos.value = null;
imagePreview.value = book.value.data.coverImage;
bookPreview.value = computed(() => {
  return book.value.data.previewFile ?? '';
}).value;
const bookPhotos = computed(() => {
  const photos = book.value.data.book_photos
    .filter(photo => photo.image_url !== book.value.data.coverImage)
    .map(photo => photo.image_url);

  if (book.value.data.coverImage) {
    return [book.value.data.coverImage, ...photos];
  }

  return [...photos];
});
const primaryPhoto = computed(() => {
  return book.value.data.coverImage;
});

selectedPublishers.value = book.value.data.publishers.map(publisher => Number(publisher.id));
selectedCategories.value = book.value.data.categories.map(category => Number(category.id));
selectedAuthors.value = book.value.data.authors.map(author => Number(author.id));

oldCategories.value = book.value.data.categories.map(category => Number(category.id));
oldAuthors.value = book.value.data.authors.map(author => Number(author.id));
oldPublishers.value = book.value.data.publishers.map(publisher => Number(publisher.id));
oldQuantity.value = book.value.data.quantity;

async function removePhoto(photo: string) {
  if (primaryPhoto.value === photo) {
    useToastError('removePhoto', 'Cannot remove the primary photo');
    return;
  }
  const bookPhotoId = book.value.data.book_photos.find(p => p.image_url === photo)?.id;
  if (!bookPhotoId) {
    useToastError('removePhoto', 'Photo not found');
    return;
  }
  const response = window.confirm('Are you sure you want to remove this photo?');
  if (!response) {
    return;
  }
  const { error } = await deleteBookPhoto(bookPhotoId);
  if (error) {
    useToastError(error);
    return;
  }
  book.value.data.book_photos = book.value.data.book_photos.filter(p => p.image_url !== photo);
  useToastSuccess('Photo removed successfully');
}

async function starPhoto(photo: string) {
  const { error } = await update(bookId.value, { cover_image: photo });
  if (error) {
    useToastError(error);
    return;
  }
  book.value.data.coverImage = photo;
  useToastSuccess('Photo starred successfully');
}

const handleFileUpload = (files: Array<File>) => {
  const photos = files.filter((photo) => photo.type.startsWith("image/"));
  if (photos.length > 0) {
    selectedPhotos.value = photos;
    previewPhotos.value = photos.map((photo) => URL.createObjectURL(photo));
  } else {
    useToastError('Please upload a valid image file.');
  }
};

const handlePreviewUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    selectedPreview.value = file;
    bookPreview.value = URL.createObjectURL(file);
  } else {
    useToastError('Please upload a valid PDF file.');
  }
};

const submitForm = async() => {
  let book = {
    id: bookId.value,
    title: title.value,
    description: description.value
  } as Tables<'books'>;

  if (selectedPreview.value) {
    book = {
      ...book,
      preview_file: selectedPreview.value
    }
  }

  await update(bookId.value, book)
    .then(async({ error }) => {
      if (error) throw error;

      //process book_authors
      if (JSON.stringify(oldAuthors.value) !== JSON.stringify(selectedAuthors.value)) {
        await deleteBooksAuthors(bookId.value)
          .then(async({ error:deleteBookAuthorErr }) => {
            if (deleteBookAuthorErr) throw deleteBookAuthorErr;

            const bookAuthors = selectedAuthors.value.map(author => ({
              author_id: author,
              book_id: bookId.value
            }));
            const { error:bookAuthorsError } = await insertBooksAuthors(bookAuthors);
            if (bookAuthorsError) throw bookAuthorsError;
          })
      }

      //process book_categories
      if (JSON.stringify(oldCategories.value) !== JSON.stringify(selectedCategories.value)) {
        await deleteBooksCategories(bookId.value)
          .then(async({ error: deletedBookCategoriesError }) => {
            if (deletedBookCategoriesError) throw deletedBookCategoriesError;

            const bookCategories = selectedCategories.value.map(category => ({
              book_id: bookId.value,
              category_id: category
            }));

            const { error:bookCategoriesError} = await insertBooksCategories(bookCategories);
            if (bookCategoriesError) throw bookCategoriesError;
          })
      }

      //process book_publishers
      if (JSON.stringify(oldPublishers.value) !== JSON.stringify(selectedPublishers.value)) {
        await deleteBooksPublishers(bookId.value)
          .then(async({ error: deletedBookPublishersError }) => {
            if (deletedBookPublishersError) throw deletedBookPublishersError;

            const bookPublishers = selectedPublishers.value.map(publisher => ({
              book_id: bookId.value,
              publisher_id: publisher
            }));

            const { error:bookPublisherError } = await insertBooksPublishers(bookPublishers);
            if (bookPublisherError) throw bookPublisherError;
          })
      }

      //process book_photos
      if (selectedPhotos.value && selectedPhotos.value.length > 1) {
        const {error:bookPhotosError} = await insertBookPhotos(selectedPhotos.value, bookId.value);
        if (bookPhotosError) throw bookPhotosError;
        selectedPhotos.value = null;
      }
    })
    .catch((error) => useToastError(error));

  //process book_items
  if (quantity.value > 0 && oldQuantity.value !== quantity.value) {
    const fixedCounts = Number(borrowingCounts.value) + Number(lostCounts.value);

    //new quantity is > old quantity => insert new item
    if (quantity.value > oldQuantity.value && quantity.value > fixedCounts) {
      const newItems = Number(quantity.value) - oldQuantity.value;
      const booksItemsData = Array.from({ length: newItems }, () => ({ book_id: bookId.value, status: BOOK_STATUS.PENDING }));
      await insertBooksItems(booksItemsData)
        .then(({ error }) => {
          if (error) throw error;
        });
    }

    //new quantity is < old quantity => remove only pending or new
    if (quantity.value < oldQuantity.value && quantity.value >= fixedCounts) {
      const removeCounts = oldQuantity.value - quantity.value;
      if (pendingCounts.value >= removeCounts) {
        await getBookItems({ columns:'id', bookIds: [bookId.value], status: [BOOK_STATUS.PENDING] })
          .order('id', {ascending:true})
          .limit(removeCounts)
          .then(async({ data, error }) => {
            if (error) throw error;

            if (data.length === 0) return;

            const ids = data?.map(row => row.id);
            await deleteBookItems({ ids: ids })
              .then(({ error }) => {
                if (error) throw error;
              });
          })
          .catch((error) => useToastError(error));
      } else {
        const openingRemove = Number(removeCounts) - Number(pendingCounts.value);
        await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.PENDING})
          .then(async({ error }) => {
            if (error) throw error;
            await getBookItems({ columns:'id', bookIds: [bookId.value], status: [BOOK_STATUS.OPENING] })
              .order('id', {ascending:true})
              .limit(openingRemove)
              .then(async({ data:openingItems , error:getOpeningItemsError }) => {
                if (getOpeningItemsError) throw getOpeningItemsError;

                const ids = openingItems?.map(item => item.id);
                await deleteBookItems({ ids: ids })
                  .then(({ error }) => {
                    if (error) throw error;
                  });
              });
          })
          .catch((error) => useToastError(error));
      }
    }

    await getBookItems({columns: 'id,status', bookIds: [bookId.value]})
      .then(({ data, error }) => {
        if (error) throw error;

        processItems(data);
      });

    await update(bookId.value, { quantity: quantity.value })
      .then(({ error }) => {
        if (error) throw error;
      })
      .catch((error) => useToastError(error));
  }
  if (quantity.value > 0 && oldQuantity.value === quantity.value) {
    if (pendingCounts.value !== bookItems.value?.pending) {
      await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.PENDING})
        .then(async({ error }) => {
          if (error) throw error;
          const booksItemsData = Array.from({ length: pendingCounts.value }, () => ({ book_id: bookId.value, status: BOOK_STATUS.PENDING }));
          await insertBooksItems(booksItemsData)
            .then(({ error }) => {
              if (error) throw error;
            });
        })
        .catch((error) => useToastError(error))
        ;
    }

    if (openingCounts.value !== bookItems.value?.opening) {
      await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.OPENING})
        .then(async({ error }) => {
          if (error) throw error;
          const booksItemsData = Array.from({ length: openingCounts.value }, () => ({ book_id: bookId.value, status: BOOK_STATUS.OPENING }));
          await insertBooksItems(booksItemsData)
            .then(({ error }) => {
              if (error) throw error;
            });
        })
        .catch((error) => useToastError(error))
        ;
    }
  }

  refresh();
  useToastSuccess();
}

const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

function onClickPrev() {
  activeIndex.value--
}
function onClickNext() {
  activeIndex.value++
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}
</script>
