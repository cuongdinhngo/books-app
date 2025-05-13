<template>
  <form class="mb-6 space-y-4 w-1/2 mx-auto" @submit.prevent="handleSearch">
    <div>
      <UModal>
        <UButton
          label="Looking for..."
          variant="subtle"
          icon="lucide-search"
          class="w-full"
        />

        <template #content>
          <UCommandPalette
            v-model:search-term="searchTerm"
            :groups="resultGroups"
            loading
            placeholder="Looking for order id, book copy id, book title, or reader name..."
            class="h-80"
            @keyup.enter="handleSearchTerm"
          />
        </template>
      </UModal>
    </div>

    <div class="flex space-x-40">
      <div class="flex-1">
        <label for="from-date" class="block text-sm font-medium text-gray-700">From Date</label>
        <UInput type="date" v-model="from" variant="subtle" class="w-full"/>
      </div>
      <div class="flex-1">
        <label for="to-date" class="block text-sm font-medium text-gray-700">To Date</label>
        <UInput type="date" v-model="to" variant="subtle" class="w-full"/>
      </div>
    </div>

    <USelectMenu
      v-model="selectedStatus"
      :items="ORDER_STATUS_OPTIONS"
      value-key="id"
      multiple
      variant="none"
      placeholder="Select order status"
      class="w-full border text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div class="flex justify-between gap-4">
      <FormSearchButton
        button-name="Search"
      />
    </div>
  </form>

  <div class="w-full">
    <OrderCard
      v-if="order?.count > 0"
      v-for="order in order?.data"
      :key="order.id"
      :order="order"
      :book="order.books"
      :user="order.users"
      :book-copies="order.books.book_copies"
      :order-renews="order.order_renews"
      :timeline="order.order_timeline"
      @refreshOrders="refresh"
    />
  </div>
  <h3 v-if="order?.count == 0" class="justify-center flex text-stone-900">No Data</h3>

  <Pagination
    v-model="page"
    v-if="order?.count > 0"
    :totalCounts="order.count"
    :items-per-page="pageSize"
    @changePage="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/constants/orders';
import { useRouteQuery } from '@vueuse/router';
import { USER_ROLE_READER } from '~/constants/users';

const { index:getOrders } = useOrders();
const { index:getBooks } = useBooks();
const { index:getBookCopies } = useBookCopies();
const { index:getReaders } = useUsers();
const router = useRouter();

const page = useRouteQuery('page', 1 , { transform: Number });
const pageSize = 5;
const orderId = useRouteQuery('id', null);
const from = ref(null);
const to = ref(null);
const searchTerm = ref(null);
const resultGroups = ref<Array<any>>([])

const selectedStatus = ref<string[]>([]);
const statusQuery = useRouteQuery('status', null).value;
if (statusQuery) {
  selectedStatus.value = Array.isArray(statusQuery) ? statusQuery : [statusQuery];
} else {
  selectedStatus.value = [];
}

const searchParams = ref({
  columns: `
    id, status, book_id, book_copy_id, due_date, created_at, returned_at,
    users!inner(id, name, photo),
    books!inner(
      id, title, cover_image,
      book_copies!inner(id, status)
    ),
    order_renews(*),
    order_timeline(*)
  `,
  status: selectedStatus.value,
  bookId: useRouteQuery('bookId', null).value,
  bookCopyId: useRouteQuery('bookCopyId', null).value,
  readerId: useRouteQuery('readerId', null).value,
  from: from.value,
  to: to.value,
  id: orderId.value,
  page: page.value,
  size: pageSize
});

console.log('searchParams => ', searchParams.value);

const { data:order, error, refresh, clear } = useAsyncData(
  `order-page-${page.value}`,
  () => getOrders(searchParams.value),
  { watch: [searchParams.value] }
);

console.log('ORDER => ', order);
console.log('ORDER ERROR => ', error);

async function handleSearchTerm() {
  console.log('searchTerm => ', searchTerm.value);
  if (!searchTerm.value) {
    resultGroups.value = [];
    return;
  };

if (searchTerm.value) {
  const searchFunctions = [];
  const resultMap = {};

  if (!isNaN(Number(searchTerm.value))) {
    // If searchTerm is a number
    searchFunctions.push(getOrders({ id: searchTerm.value }).then(result => resultMap.orders = result));
    searchFunctions.push(getBookCopies({ ids: [searchTerm.value] }).then(result => resultMap.bookCopies = result));
  }

  if (searchTerm.value.length >= 2) {
    // If searchTerm is an alphabet or string
    searchFunctions.push(getBooks({ title: searchTerm.value }).then(result => resultMap.books = result));
    searchFunctions.push(getReaders({ name: searchTerm.value, role: USER_ROLE_READER }).then(result => resultMap.readers = result));
  }

  await Promise.all(searchFunctions);

  // Access results from resultMap
  const { orders, bookCopies, books, readers } = resultMap;

  console.log('Orders:', orders);
  console.log('Book Copies:', bookCopies);
  console.log('Books:', books);
  console.log('Readers:', readers);
    if (books && null === books.error && books?.count > 0) {
    resultGroups.value.push({
      id: 'books',
      label: 'Books',
      items: books.data.map(item => ({
        id: item.id,
        label: item.title,
        to: `/admin/orders?bookId=${item.id}`,
        target: '_blank',
        avatar: {
          src: item.coverImage
        }
      }))
    });
  }

  if (orders && null === orders.error && orders?.count > 0) {
    resultGroups.value.push({
      id: 'orders',
      label: 'Orders',
      items: orders.data.map(item => ({
        id: item.id,
        label: item.id,
        to: `/admin/orders?id=${item.id}`,
        target: '_blank',
        avatar: {
          src: '/img/book.png'
        }
      }))
    });
  }

  if (bookCopies && null === bookCopies.error && bookCopies?.count > 0) {
    resultGroups.value.push({
      id: 'bookCopies',
      label: 'Hard Copy Id',
      items: bookCopies.data.map(item => ({
        id: item.id,
        label: item.id,
        to: `/admin/orders?bookCopyId=${item.id}`,
        target: '_blank',
        avatar: {
          src: '/img/order.png'
        }
      }))
    });
  }

  if (readers && null === readers.error && readers?.count > 0) {
    resultGroups.value.push({
      id: 'readers',
      label: 'Readers',
      items: readers.data.map(item => ({
        id: item.id,
        label: item.name,
        to: `/admin/orders?readerId=${item.id}`,
        target: '_blank',
        avatar: {
          src: `${item.photo || '/img/user.png'}` 
        }
      }))
    });
  }
}

}

function handleSearch() {
  searchParams.value.id = orderId.value;
  searchParams.value.status = selectedStatus.value;
  searchParams.value.from = from.value;
  searchParams.value.to = to.value;
  router.replace({
    name: 'admin-orders',
    query: { id: orderId.value, status: selectedStatus.value, from: from.value, to: to.value }
  });
}

function handlePageChange(newPage) {
  page.value = newPage;
  searchParams.value.page = newPage;
}

</script>