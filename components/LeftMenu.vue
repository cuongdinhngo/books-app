<template>
  <aside class="bg-gray-800 text-white w-full md:w-64 p-4 h-auto md:h-screen">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      variant="pill"
      highlight
      highlight-color="red"
      class="data-[orientation=vertical]:w-48"
    />
  </aside>
</template>

<script setup>
const { adminRoutes, getRouteByName } = useRouters();
const items = ref([
  {
    label: 'Home',
    name: 'home',
    to: '/admin/',
    icon: 'i-lucide-house'
  },
  {
    label: 'Books',
    name: 'books',
    to: '/admin/books/',
    icon: 'i-lucide-book-open',
    children: [
      {
        label: 'All Books',
        icon: 'lucide:notebook-text',
        name: 'books',
        to: '/admin/books/',
      },
      {
        label: 'Authors',
        icon: 'i-lucide-file-text',
        name: 'authors',
        to: '/admin/authors'
      },
      {
        label: 'Publishers',
        icon: 'i-lucide-swatch-book',
        name: 'publishers',
        to: '/admin/publishers'
      },
      {
        label: 'Categories',
        icon: 'i-lucide-cog',
        name: 'categories',
        to: '/admin/categories'
      }
    ]
  },
  {
    label: 'Orders',
    name: 'orders',
    to: '/admin/orders/',
    icon: 'lucide:shopping-cart'
  },
  {
    label: 'Staff',
    name: 'staff',
    to: '/admin/staff/',
    icon: 'lucide:shield-user'
  },
  {
    label: 'Readers',
    name: 'readers',
    to: '/admin/readers/',
    icon: 'lucide:users'
  },
]);
</script>