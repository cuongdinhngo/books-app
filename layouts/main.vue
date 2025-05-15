<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <div class="flex-1 flex flex-col md:flex-row overflow-auto">
      <section class="flex-1 p-6 bg-blue-50 flex flex-col">
        <div class="mb-4">
          <Breadcrumb />
        </div>
        <div class="bg-white p-6 rounded-lg shadow flex-1 flex flex-col">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>