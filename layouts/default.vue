<template>
  <Header />
  <div class="flex flex-col md:flex-row">
    <LeftMenu />
    <section class="flex-grow p-6 bg-blue-50">
      <!-- <Breadcrumb /> -->
      <div class="bg-white p-6 rounded-lg shadow">
        <slot />
      </div>
    </section>
  </div>
</template>