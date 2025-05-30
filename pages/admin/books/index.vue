<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div class="flex items-center space-x-4">
      <input
        v-model="title"
        type="text"
        placeholder="Search by book title"
        class="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-stone-800"
      >
      <button
          type="button"
          @click="showAdvancedSearch = !showAdvancedSearch"
          class="text-blue-500 font-medium hover:text-blue-800 focus:outline-none"
      >
          {{ showAdvancedSearch ? 'Hide Advanced Search' : 'Advanced Search' }}
      </button>
    </div>

    <!-- Add transition wrapper here -->
    <transition name="fade-slide">
      <div v-if="showAdvancedSearch">
        <div class="my-2">
          <label class="block text-sm font-medium text-gray-700">Publisher</label>
          <FilterPublisher
            v-model="selectedPublishers"
          />
        </div>

        <div class="my-2">
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <FilterCategory
            v-model="selectedCategories"
          />
        </div>

        <div class="my-2">
          <label class="block text-sm font-medium text-gray-700">Author</label>
          <FilterAuthor
            v-model="selectedAuthors"
          />
        </div>

        <div class="my-2">
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <USelectMenu
            v-model="bookCopyStatus"
            :items="BOOK_COPY_OPTION"
            value-key="id"
            variant="none"
            placeholder="Select status"
            class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </transition>

    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
      <FormCreateLink
        name="Create New Book"
        :to="{ name: 'admin-books-create' }"
      />
    </div>
  </form>

  <DataTable
    v-if="status === 'success'"
    :data="book?.data"
    :columns="[
      {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
      },
      {
        accessorKey: 'coverImage',
        header: 'Book',
      },
      {
        accessorKey: 'book_copies',
        header: 'Quantity',
        id: 'bookCopyQuantity',
      },
      {
        header: 'Actions',
        id: 'crud-actions',
      }
    ]"
    :delete-item="deleteBook"
    edit-link="admin-books-id"
  />
  <LoadingProcess
    v-if="status === 'pending'"
  />
  <h3 v-if="book?.count == 0" class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="book?.count > 0"
    :totalCounts="book?.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import { useRouteParams, useRouteQuery } from '@vueuse/router';
import { BOOK_COPY_OPTION } from '~/constants/bookCopies';

const { index:getBooks, remove } = useBooks();
const { remove:deleteBooksAuthors } = useBooksAuthors();
const { remove:deleteBooksCategories } = useBooksCategories();
const { remove:deleteBooksPublishers } = useBooksPublishers();
const { remove:deleteBookItems } = useBookCopies();
const { query } = useRoute();
const router = useRouter();

const page = ref(useRouteParams('page', 1, { transform: Number }));
const pageSize = 10;
const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const showAdvancedSearch = ref(false);
const bookCopyStatus = ref([]);
const statusQuery = useRouteQuery('status', null).value;
if (statusQuery) {
  bookCopyStatus.value = Array.isArray(statusQuery) ? statusQuery : [statusQuery];
}

const searchParams = ref({
  title: title.value,
  authorIds: selectedAuthors.value,
  categoryIds: selectedCategories.value,
  publisherIds: selectedPublishers.value,
  status: bookCopyStatus.value,
  page: page.value,
  size: pageSize
});

const { data: book, error, refresh, status, clear} = await useAsyncData(
  `books?title=${title.value}&authorIds=${selectedAuthors.value}&categoryIds=${selectedCategories.value}&publisherIds=${selectedPublishers.value}&status=${bookCopyStatus.value}&page=${page.value}`,
  () => getBooks(searchParams.value),
  {
    transform: (data) => {      
      if (data && data.data) {
        return {
          ...data,
          data: data.data.map(book => {
            const totalCopies = book.book_copies ? book.book_copies.length : 0;
            const statusGroups = {};
            if (book.book_copies && book.book_copies.length > 0) {
              book.book_copies.forEach(copy => {
                if (!statusGroups[copy.status]) {
                  statusGroups[copy.status] = 0;
                }
                statusGroups[copy.status]++;
              });
            }

            const orderedCopies = { total: totalCopies };
            BOOK_COPY_OPTION.forEach(option => {
              if (statusGroups[option.id]) {
                orderedCopies[option.id] = statusGroups[option.id];
              }
            });
            
            return {
              ...book,
              book_copies: orderedCopies
            };
          })
        };
      }
      return data;
    }, 
    watch: [searchParams.value]
  }
);

const handleSearch = async() => {
  page.value = 1;
  searchParams.value.title = title.value;
  searchParams.value.authorIds = selectedAuthors.value;
  searchParams.value.categoryIds = selectedCategories.value;
  searchParams.value.publisherIds = selectedPublishers.value;
  searchParams.value.page = page.value;
  searchParams.value.status = [bookCopyStatus.value];
};

const handlePageChange = async(newPage) => {
  page.value = newPage;
  searchParams.value.page = newPage;
}

function deleteBook(bookId: number) {
  const result = window.confirm('Are you sure to want to delete this book!');
  if (!result) {
    return;
  }
  Promise
    .all([
      deleteBookItems({ bookId: bookId }),
      deleteBooksAuthors(bookId),
      deleteBooksCategories(bookId),
      deleteBooksPublishers(bookId)
    ])
    .then(async() => {
      await remove(bookId);
      const { count, error } = await index(searchParams.value);
      const newPage = getNewPage(page.value, count, pageSize);
      if (newPage === page.value) {
        refresh();
      } else {
        clear();
        navigateTo(`/admin/books?page=${newPage}#with-links`);
      }
    })
    .catch((error) => useToastError(error));
  ;
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>