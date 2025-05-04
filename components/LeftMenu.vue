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
const items = ref([
  {
    label: 'Home',
    name: 'home',
    to: { name: 'admin'},
    icon: 'lucide:house'
  },
  {
    label: 'Books',
    name: 'books',
    to: { name: 'admin-books'},
    icon: 'lucide:book-open'
  },
  {
    label: 'Orders',
    name: 'orders',
    to: { name: 'admin-orders' },
    icon: 'lucide:shopping-cart'
  },
  {
    label: 'Staff',
    name: 'staff',
    to: { name: 'admin-staff' },
    icon: 'lucide:shield-user'
  },
  {
    label: 'Readers',
    name: 'readers',
    to: { name: 'admin-readers' },
    icon: 'lucide:users'
  },
  {
    label: 'Settings',
    name: 'settings',
    icon: 'lucide:cog',
    children: [
      {
        label: 'Authors',
        icon: 'lucide:file-text',
        name: 'authors',
        to: { name: 'admin-authors' }
      },
      {
        label: 'Publishers',
        icon: 'lucide:swatch-book',
        name: 'publishers',
        to: { name: 'admin-publishers' }
      },
      {
        label: 'Categories',
        icon: 'lucide:cog',
        name: 'categories',
        to: { name: 'admin-categories' }
      }
    ]
  },
]);
</script>