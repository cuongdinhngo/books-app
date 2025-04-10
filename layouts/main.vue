<template>
  <MainHeader />
  <div class="flex flex-col md:flex-row">
    <MainLeftMenu />
    <section class="flex-grow p-6 bg-blue-50">
      <!-- <MainBreadcrumb /> -->
      <div class="bg-white p-6 rounded-lg shadow">
        <slot />
      </div>
    </section>
  </div>
</template>