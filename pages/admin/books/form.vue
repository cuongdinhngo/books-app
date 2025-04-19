<template>
  <div class="mb-6 flex flex-col md:flex-row gap-6">
    <form class="space-y-4 w-full md:w-1/2" @submit.prevent="submitForm">
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
        @change="handleFileUpload"
      />

      <FormInputNumberDiv
        v-model="quantity"
        label-name="Quantity"
        placeholder="Enter quantity"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <UTextarea
          v-model="description"
          :rows="5"
          autoresize
          class="w-full"
        />
      </div>

      <FormButtonDiv
        :label="useRoute().query?.id ? 'Update' : 'Add new'"
      />

      <h3 v-if="message" :class="textColor">{{ message }}</h3>
    </form>

    <!-- Photo Preview -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <FormPhotoReview
        :image-preview="imagePreview"
      />
    </div>
  </div>
  <div>
    <h3 v-if="status !== 'success'" class="justify-center flex text-stone-900">Loading ...</h3>

    <DataTable
      v-if="bookItemsList.count > 0"
      :data="bookItemsList.data"
      :columns="columns"
      :get-dropdown-actions="getActionItems"
    />
    <h3 v-else class="justify-center flex text-stone-900">No Book Items</h3>

    <Pagination
      v-if="bookItemsList.count > 0"
      v-model="page"
      :totalCounts="bookItemsList.count"
      :items-per-page="itemsPerPage"
      @changePage="handlePageChange"
    />

    <UModal title="Update status" v-model:open="openBookItemModal">
      <template #body>
        <USelect
          v-model="currentBookStatus"
          :items="bookStatus"
          value-key="id"
          class="w-48"
          @change="handleBookStatus"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';

const { index, insert, get, update, remove } = useBooks();
const { insertBooksAuthors, deleteBooksAuthors } = useBooksAuthors();
const { insertBooksCategories, deleteBooksCategories } = useBooksCategories();
const { insertBooksPublishers, deleteBooksPublishers } = useBooksPublishers();
const {
  insertBooksItems,
  getBooksItems,
  updateBookItemStatus,
  deleteBookItems
} = useBookItems();

const { query } = useRoute();
const page = ref(Number(query.page) || 1);
const bookId = Number(query.id);

const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const selectedPhoto = ref(null);
const imagePreview = ref('');
const quantity = ref(0);
const description = ref(null);
const textColor = ref('');
const message = ref('');
const oldQuantity = ref(0);
const oldAuthors = ref([]);
const oldCategories = ref([]);
const oldPublishers = ref([]);

const itemsPerPage = 10;

const openBookItemModal = ref(false);
const currentBookItem = ref(null);

const bookStatus = [
  {
    label: 'Pending',
    id: 'pending'
  },
  {
    label: 'Open',
    id: 'open'
  },
  {
    label: 'Borrowed',
    id: 'borrowed'
  },
  {
    label: 'Lost',
    id: 'lost'
  }
];
const currentBookStatus = ref('');

const { data: bookItemsList, error, refresh, status } = await useAsyncData(
  `book-items-page-${page.value}`,
  () => {
    if (bookId) {
      return getBooksItems({ bookId: bookId, page: page.value, size: itemsPerPage });
    } else {
      return [];
    }
  },
  { watch: [page.value] }
);

console.log('STATUS => ', status);

const handleBookStatus = async() => {
  await updateBookItemStatus(currentBookItem.value, {status: currentBookStatus.value})
    .then(({error: updatedError}) => {
      if (updatedError) throw updatedError;
    })
    .catch((error) => {
      useToastError(error)
    })
  ;
  openBookItemModal.value = !openBookItemModal.value;
  refresh();
}

const handlePageChange = async(newPage) => {
  page.value = newPage;
  refresh();
}

onMounted(async() => {
  if (bookId) {
    const { data: book } = await get(bookId);
    title.value = book?.title;
    description.value = book?.description;
    quantity.value = book?.quantity;
    selectedPhoto.value = null;
    imagePreview.value = book?.coverImage;
    selectedPublishers.value = book?.publishers.map(publisher => Number(publisher.id));
    selectedCategories.value = book?.categories.map(category => Number(category.id));
    selectedAuthors.value = book?.authors.map(author => Number(author.id));
    oldCategories.value = book?.categories.map(category => Number(category.id));
    oldAuthors.value = book?.authors.map(author => Number(author.id));
    oldPublishers.value = book?.publishers.map(publisher => Number(publisher.id));
    oldQuantity.value = book?.quantity;
  }
});

const handleFileUpload = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  message.value = '';
  let book = {
    title: title.value,
    quantity: quantity.value,
    description: description.value
  } as Tables<'books'>;

  if (bookId) {
    book = {
      ...book,
      id: Number(query.id)
    }
  }

  if (selectedPhoto.value) {
    book = {
      ...book,
      cover_image: selectedPhoto.value
    }
  }

  const { error } = bookId ? await update(bookId, book) : await insert(book);
  if (null === error) {
    const { data } = await index({ columns: 'id,title', title: title.value });
    const bookId = Number(data?.[0].id);

    if (
      selectedAuthors.value.length > 0 &&
      JSON.stringify(oldAuthors.value) !== JSON.stringify(selectedAuthors.value)
    ) {
      await deleteBooksAuthors(bookId)
        .then(({ error: deletedError }) => {
          if (deletedError) throw deletedError;

          const booksAuthors = selectedAuthors.value.map(author => ({
            author_id: author,
            book_id: bookId
          }));

          return insertBooksAuthors(booksAuthors);
        })
        .catch((error) => {
          useToastError(error)
        });
    }

    if (
      selectedCategories.value.length > 0 &&
      JSON.stringify(oldCategories.value) !== JSON.stringify(selectedCategories.value)
    ) {
      await deleteBooksCategories(bookId)
        .then(({ error: deletedError }) => {
          if (deletedError) throw deletedError;

          const booksCategories = selectedCategories.value.map(category => ({
            book_id: bookId,
            category_id: category
          }));

          return insertBooksCategories(booksCategories);
        })
        .catch((error) => {
          useToastError(error)
        });
    }

    if (
      selectedPublishers.value.length > 0 &&
      JSON.stringify(oldPublishers.value) !== JSON.stringify(selectedPublishers.value)
    ) {
      await deleteBooksPublishers(bookId)
        .then(({ error: deletedError }) => {
          if (deletedError) throw deletedError;

          const booksPublishers = selectedPublishers.value.map(publisher => ({
            book_id: bookId,
            publisher_id: publisher
          }));

          return insertBooksPublishers(booksPublishers);
        })
        .catch((error) => {
          useToastError(error)
        });
    }

    if (quantity.value > 0 && oldQuantity.value !== quantity.value) {
      const booksItemsData = Array.from({ length: book.quantity }, () => ({ book_id: bookId, status: 'pending' }));
      await insertBooksItems(booksItemsData)
        .then(async({ error }) => {
          if (error) throw error;
        })
        .catch((error) => {
          useToastError(error)
        });
    }

    const { data: booksItemsData } = await getBooksItems({bookId: bookId});
    bookItemsList.value = booksItemsData;

    message.value = query?.id ? 'Book was updated succesfully!' : 'New Book was created succesfully!';
    textColor.value = 'text-green-600';

    useToastSuccess();

    navigateTo(`/admin/books/form?id=${bookId}`);
  } else {
    console.log('[ERROR] book => ', error);
    message.value = query?.id ? 'Book was updated failed!' : 'Creating new Book was failed!';
    textColor.value = 'text-red-500';
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'status',
    header: 'Status',
    id: 'bookItemStatus'
  },
  {
    header: 'Actions',
    id: 'actions'
  }
]

function getActionItems(bookItem) {
  return [
    {
      label: 'Update status',
      onSelect() {
        openBookItemModal.value = !openBookItemModal.value;
        currentBookItem.value = bookItem.id;
        currentBookStatus.value = bookItem.status;
      }
    },
    {
      label: 'Delete',
      async onSelect() {
        await deleteBookItems({ ids: [bookItem.id] });
        refresh();
      }
    }
  ]
}
</script>