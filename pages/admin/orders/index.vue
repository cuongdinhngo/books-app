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
      v-if="status === 'success'"
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
    <LoadingCard
      v-if="status === 'pending'"
      :quantity="5"
      :class-value="`h-[200px] w-full my-5`"
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

const route = useRoute();
const currentQuery = useRoute().query;
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
    order_timeline(
      *,
      users!inner(id, name, role)
    )
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

const { data:order, error, refresh, status } = useAsyncData(
  `orders-${JSON.stringify(searchParams.value)}`,
  () => getOrders(searchParams.value),
  { watch: [searchParams.value] }
);

async function handleSearchTerm() {
  if (!searchTerm.value) {
    resultGroups.value = [];
    return;
  };

  if (searchTerm.value) {
    const searchFunctions = [];
    const resultMap = {};

    if (!isNaN(Number(searchTerm.value))) {
      searchFunctions.push(getOrders({ id: searchTerm.value })
        .then(result => resultMap.orders = result));
      searchFunctions.push(getBookCopies({ ids: [searchTerm.value] })
        .then(result => resultMap.bookCopies = result));
    }

    if (searchTerm.value.length >= 2) {
      searchFunctions.push(getBooks({ title: searchTerm.value })
        .then(result => resultMap.books = result));
      searchFunctions.push(getReaders({ name: searchTerm.value, role: USER_ROLE_READER })
        .then(result => resultMap.readers = result));
    }

    await Promise.all(searchFunctions);
    const { orders, bookCopies, books, readers } = resultMap;

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

watch(
  () => useRoute().query,
  (newQuery) => {
    if (newQuery.page) {
      page.value = Number(newQuery.page);
      searchParams.value.page = Number(newQuery.page);
    }
    if (newQuery.id) {
      orderId.value = newQuery.id;
      searchParams.value.id = newQuery.id;
    }
    if (newQuery.bookId) {
      searchParams.value.bookId = newQuery.bookId;
    }
    if (newQuery.bookCopyId) {
      searchParams.value.bookCopyId = newQuery.bookCopyId;
    }
    if (newQuery.readerId) {
      searchParams.value.readerId = newQuery.readerId;
    }
    if (newQuery.status) {
      selectedStatus.value = Array.isArray(newQuery.status) ? newQuery.status : [newQuery.status];
      searchParams.value.status = selectedStatus.value;
    }
    if (newQuery.from) {
      from.value = newQuery.from;
      searchParams.value.from = newQuery.from;
    }
    if (newQuery.to) {
      to.value = newQuery.to;
      searchParams.value.to = newQuery.to;
    }
  }
);

function handleSearch() {
  page.value = 1;
  searchParams.value.id = orderId.value;
  searchParams.value.status = selectedStatus.value;
  searchParams.value.from = from.value;
  searchParams.value.to = to.value;
  searchParams.value.page = 1;
}

function handlePageChange(newPage) {
  page.value = newPage;
  searchParams.value.page = newPage;
}
</script>
