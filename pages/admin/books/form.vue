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

      <h3 v-if="errorMessage" class="text-red-500">{{ errorMessage }}</h3>
      <h3 v-if="successMessage" class="text-green-600">{{ successMessage }}</h3>
    </form>

    <!-- Photo Preview -->
    <div class="w-full md:w-1/2 flex items-center justify-center">
      <FormPhotoReview
        :image-preview="imagePreview"
      />
    </div>
  </div>
  <div>
    <DataTable
      v-if="bookItems.length > 0"
      :data="bookItems"
      :columns="columns"
    />
    <h3 v-else class="justify-center flex text-stone-900">No Book Items</h3>

    <Pagination
      v-if="totalBookItems > 0"
      v-model="page"
      :totalCounts="totalBookItems"
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

<script setup>

const { processBook, getBookById, book } = useBooks();
const { processBookAuthor } = useBooksAuthors();
const { processBookCategory } = useBooksCategories();
const { processBookPublisher } = useBooksPublishers();
const {
  bookItems,
  getItemsByBookId,
  insertBookItems,
  totalBookItems,
  itemsPerPage,
  updateBookItemStatus,
  deleteBookItem
} = useBookItems();

const page = ref(1);
const title = ref(null);
const selectedAuthors = ref(null);
const selectedCategories = ref(null);
const selectedPublishers = ref(null);
const selectedPhoto = ref(null);
const imagePreview = ref(null);
const quantity = ref(null);
const description = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const oldAuthors = ref(null);
const oldCategories = ref(null);
const oldPublishers = ref(null);

const openBookItemModal = ref(false);
const currentBookItem = ref(null);

const bookStatus = ref([
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
])
const currentBookStatus = ref('');

const UBadge = resolveComponent('UBadge');
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const columns = [
  {
    accessorKey: 'id',
    header: '#ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        open: 'success',
        pending: 'info',
        borrowed: 'warning',
        lost: 'neutral'
      }[row.getValue('status')]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getActionItems(row),
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto text-stone-800',
              'aria-label': 'Actions dropdown'
            })
        )
      )
    }
  }
]

function getActionItems(row) {
  return [
    {
      label: 'Update status',
      onSelect() {
        openBookItemModal.value = !openBookItemModal.value;
        currentBookItem.value = row.original.id;
        currentBookStatus.value = row.original.status;
      }
    },
    {
      label: 'Delete',
      async onSelect() {
        deleteBookItem(row.original.id);
        await getItemsByBookId(useRoute().query.id, Number(useRoute().query.page));
      }
    }
  ]
}

const handleBookStatus = async() => {
  await updateBookItemStatus(currentBookItem.value, {status: currentBookStatus.value});
  await getItemsByBookId(useRoute().query.id, Number(useRoute().query.page));
  openBookItemModal.value = !openBookItemModal.value;
}

const handlePageChange = async(newPage) => {
  await getItemsByBookId(useRoute().query.id, Number(newPage));
}

onMounted(async() => {
  const routeQuery = useRoute().query;
  const bookId = routeQuery.id;
  if (bookId) {
    await getBookById(bookId);
    title.value = book.value.title;
    description.value = book.value.description;
    quantity.value = book.value.quantity;
    selectedPhoto.value = null;
    imagePreview.value = book.value.coverImage;
    selectedPublishers.value = book.value.publishers.map(publisher => publisher.id);
    selectedCategories.value = book.value.categories.map(category => category.id);
    selectedAuthors.value = book.value.authors.map(author => author.id);
    oldCategories.value = book.value.categories.map(category => category.id);
    oldAuthors.value = book.value.authors.map(author => author.id);
    oldPublishers.value = book.value.publishers.map(publisher => publisher.id);

    await getItemsByBookId(bookId, Number(routeQuery.page | 1));

    console.log('Total Book Items -> ', totalBookItems.value);
  }
});

const handleFileUpload = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async() => {
  let data = {
    id: useRoute().query?.id,
    title: title.value,
    quantity: quantity.value || null,
    description: description.value || null
  };

  if (selectedPhoto.value) {
    data = {
      ...data,
      cover_image: selectedPhoto.value
    }
  }

  const response = await processBook(data);
  if (response && response?.id) {
    const bookId = response?.id;

    if (oldAuthors.value !== selectedAuthors.value) {
      await processBookAuthor(
        bookId,
        selectedAuthors.value.map(author => ({
          book_id: bookId,
          author_id: author,
        })),
        oldAuthors.value
      );
    }

    if (oldCategories.value !== selectedCategories.value) {
      await processBookCategory(
        bookId,
        selectedCategories.value.map(category => ({
          category_id: category,
          book_id: bookId
        })),
        oldCategories.value
      );
    }

    if (oldPublishers.value !== selectedPublishers.value) {
      await processBookPublisher(
        bookId,
        selectedPublishers.value.map(publisher => ({
          publisher_id: publisher,
          book_id: bookId
        })),
        oldCategories.value
      );
    }

    await insertBookItems(quantity.value, {book_id: bookId, status: 'pending'})
    await getItemsByBookId(bookId);

    successMessage.value = 'New book was created succesfully!'
  } else {
    errorMessage.value = 'Creating new book was failed!'
  }
}
</script>