<template>
  <header class="bg-primary-500 p-4 flex items-center justify-between">
    <div class="text-2xl font-bold text-white">Admin::Look Book</div>

    <div class="w-1/2">
      <UModal>
        <UButton
          label="Searching..."
          color="neutral"
          variant="subtle"
          icon="lucide-search"
          class="w-100"
        />

        <template #content>
          <UCommandPalette
            v-model:search-term="searchTerm"
            :groups="resultGroups"
            loading
            placeholder="Looking for books, categories, or publishers..."
            class="h-80"
            @keyup.enter="handleSearch"
          />
        </template>
      </UModal>
    </div>

    <div class="flex items-center space-x-4">
      <USlideover title="" description="">
        <UChip
          v-if="unreadNotificaitons.length > 0"
          :text="unreadNotificaitons.length"
          size="3xl"
          color="neutral"
          :ui="{
            base: 'text-stone-900 bg-primary-50',
          }"
        >
          <UButton
            icon="lucide:bell"
            color="neutral"
            variant="outline"
            class="ring-0 bg-primary-800 text-lg cursor-pointer"
          />
        </UChip>
        <UButton
          v-else
          icon="lucide:bell"
          color="neutral"
          variant="outline"
          class="ring-0 bg-primary-800 text-lg cursor-pointer"
        />

        <template #header>
          <div>
            <DialogTitle class="text-lg font-semibold mb-2">Notifications</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>This panel shows notification filters and recent alerts.</DialogDescription>
            </VisuallyHidden>
            <div class="flex space-x-4">
              <p class="cursor-pointer hover:bg-blue-300 bg-blue-200 px-3 rounded-lg text-blue-500 font-bold">All</p>
              <p class="cursor-pointer hover:text-blue-500">Unread</p>
            </div>
          </div>
        </template>

        <template #body>
          <NotificationItem
            v-for="notification in notifications.data"
            :key="notification.id"
            :notification="notification"
          />
        </template>
      </USlideover>

      <UDropdownMenu
        class="bg-primary-600 border-primary-900 hover:bg-primary-700"
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 1
        }"
        :ui="{
          content: 'w-40'
        }"
      >
        <UButton icon="lucide:settings" color="neutral" variant="outline" class="ring-0 bg-primary-800 text-lg" />
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { DialogTitle, VisuallyHidden, DialogDescription } from 'reka-ui';
import { USER_ROLE_READER } from '~/constants/users';

const { signout, userId } = useAuth();
const { index:getBooks } = useBooks();
const { index:getOrders } = useOrders();
const { index:getReaders } = useUsers();
const { index:getBookCopies } = useBookCopies();
const { index:getCategories } = useCategories();
const { index:getPublishers } = usePublishers();
const { index:getAuthors } = useAuthors();

const searchTerm = ref<string>('');
const resultGroups = ref<Array<any>>([]);
const items = [
  {
    label: 'Profile',
    icon: 'lucide:user',
    to: { name: 'admin-staff-id', params: { id: userId.value }}
  },
  {
    label: 'Logout',
    icon: 'lucide:log-out',
    async onSelect() {
      await signout();
      navigateTo('/login')
    }
  }
];

const { data:notifications, error } = await useAsyncData(
  `admin-notifications`,
  () => useTable('notifications').select().is('user_id', null).order('created_at', { ascending: false })
);

const unreadNotificaitons = computed(() => notifications.value.data.filter(item => !item.is_read));

async function handleSearch() {
  if (!searchTerm.value) {
    resultGroups.value = [];
    return;
  };

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
    searchFunctions.push(getAuthors({ name: searchTerm.value })
      .then(result => resultMap.authors = result));
    searchFunctions.push(getCategories({ name: searchTerm.value })
      .then(result => resultMap.categories = result));
    searchFunctions.push(getPublishers({ name: searchTerm.value })
      .then(result => resultMap.publishers = result));
  }

  await Promise.all(searchFunctions);
  const { orders, bookCopies, books, readers, authors, categories, publishers } = resultMap;
  console.log('RESULT MAP => ', resultMap);

  if (orders && null === orders.error && orders?.count > 0) {
    resultGroups.value.push({
      id: 'orders',
      label: 'Orders',
      items: orders.data.map(item => ({
        id: item.id,
        label: `Order No. #${item.id}`,
        to: { name: 'admin-orders', query: { id: item.id }},
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
        label: `Hard Copy #${item.id}`,
        to: { name: 'admin-orders', query: { bookCopyId: item.id }},
        target: '_blank',
        avatar: {
          src: '/img/order.png'
        }
      }))
    });
  }

  if (null === books.error && books?.count > 0) {
    resultGroups.value.push({
      id: 'books',
      label: 'Books',
      items: books.data.map(item => ({
        id: item.id,
        label: item.title,
        to: { name: 'admin-books-id', params: { id: item.id }},
        target: '_blank',
        avatar: {
          src: item.coverImage
        }
      }))
    });
  }

  if (null === categories.error && categories?.count > 0) {
    resultGroups.value.push({
      id: 'categories',
      label: 'Categories',
      items: categories.data.map(item => ({
        id: item.id,
        label: item.name,
        to: { name: 'admin-categories-id', params: { id: item.id }},
        target: '_blank'
      }))
    });
  }

  if (null === publishers.error && publishers?.count > 0) {
    resultGroups.value.push({
      id: 'publishers',
      label: 'Publishers',
      items: publishers.data.map(item => ({
        id: item.id,
        label: item.name,
        to: { name: 'admin-publishers-id', params: { id: item.id }},
        target: '_blank',
        avatar: {
          src: item.logo || '/img/book.png'
        }
      }))
    });
  }

  if (null === authors.error && authors?.count > 0) {
    resultGroups.value.push({
      id: 'authors',
      label: 'Authors',
      items: authors.data.map(item => ({
        id: item.id,
        label: item.full_name,
        to: { name: 'admin-authors-id', params: { id: item.id }},
        target: '_blank',
        avatar: {
          src: item.photo || '/img/user.png'
        }
      }))
    });
  }

  if (null === readers.error && readers?.count > 0) {
    resultGroups.value.push({
      id: 'readers',
      label: 'Readers',
      items: readers.data.map(item => ({
        id: item.id,
        label: item.name,
        to: { name: 'admin-readers-id', params: { id: item.id }},
        target: '_blank',
        avatar: {
          src: item.photo || '/img/user.png'
        }
      }))
    });
  }
}
</script>