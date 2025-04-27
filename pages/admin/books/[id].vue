<template>
  <div class="bg-white p-6 w-full">
    <form @submit.prevent="submitForm">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left Side -->
        <div class="w-full md:w-1/2 space-y-4">
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

          <div>
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <UInputNumber
              v-model="quantity"
              orientation="vertical"
              placeholder="Enter quantity"
              :min="0"
              @change="updateItemStatus"
            />
          </div>
        </div>
        <!-- Photo Preview -->
        <div class="w-full md:w-1/2">
          <div class="flex w-75 h-90 bg-gray-100 rounded-md">
            <img id="photoPreview" :src="imagePreview" alt="Photo Preview" class="rounded-md">
          </div>
        </div>
      </div>
      <div class="mt-6">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <UTextarea
          v-model="description"
          :rows="5"
          autoresize
          class="w-full"
        />
      </div>
      <div class="mt-6 flex flex-row gap-4">
        <div class="flex-1 flex items-center space-x-2">
          <label for="pending" class="text-sm font-medium text-gray-700 p-2 bg-violet-300 rounded-2xl">Pending:</label>
          <UInputNumber
            v-model="pendingCounts"
            orientation="vertical"
            :min="0"
            @change="updateItemStatus(BOOK_STATUS.PENDING)"
          />
        </div>
        <div class="flex-1 flex items-center space-x-2">
          <label for="pending" class="text-sm font-medium text-gray-700 p-2 bg-green-300 rounded-2xl">Opening:</label>
          <UInputNumber
            v-model="openingCounts"
            orientation="vertical"
            :min="0"
            @change="updateItemStatus(BOOK_STATUS.OPENING)"
          />
        </div>
        <div class="flex-1 flex items-center space-x-2">
          <label for="pending" class="text-sm font-medium text-gray-700 p-2 bg-orange-300 rounded-2xl">Borrowing:</label>
          <UInputNumber
            v-model="borrowingCounts"
            orientation="vertical"
            disabled
          />
        </div>
        <div class="flex-1 flex items-center space-x-2">
          <label for="pending" class="text-sm font-medium text-gray-700 p-2 bg-gray-300 rounded-2xl">Lost:</label>
          <UInputNumber
            v-model="lostCounts"
            orientation="vertical"
            disabled
          />
        </div>
      </div>
      <div class="mt-6">
        <button
          type="submit"
          class="w-full md:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Update
        </button>
      </div>
    </form>
    <USeparator icon="lucide:list" :label="`Historical Orders: ${orderItems.length}`" class="mt-5" 
      :ui="{
        label: 'text-primary-800 text-lg'
      }"
    />

    <DataTable
      v-if="orderItems.length > 0"
      :data="orderItems"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '~/types/database.types';
import { useRouteParams } from '@vueuse/router';
import { BOOK_STATUS } from '~/composables/books';
import { NuxtLink } from '#components';

const { get, update } = useBooks();
const { insert:insertBooksAuthors, remove:deleteBooksAuthors } = useBooksAuthors();
const { insert:insertBooksCategories, remove:deleteBooksCategories } = useBooksCategories();
const { insert:insertBooksPublishers, remove:deleteBooksPublishers } = useBooksPublishers();
const { insert:insertBooksItems, remove:deleteBookItems, index:getBookItems } = useBookItems();
const { index:getOrderItems} = useOrderItems();

const bookId = useRouteParams('id', null, { transform: Number });

const title = ref('');
const selectedAuthors = ref([]);
const selectedCategories = ref([]);
const selectedPublishers = ref([]);
const selectedPhoto = ref(null);
const imagePreview = ref('');
const quantity = ref(0);
const description = ref(null);
const oldQuantity = ref(0);
const oldAuthors = ref([]);
const oldCategories = ref([]);
const oldPublishers = ref([]);
const bookItems = ref([]);
const pendingCounts = ref(0);
const openingCounts = ref(0);
const borrowingCounts = ref(0);
const lostCounts = ref(0);
const orderItems = ref([]);

const { data, error, refresh } = await useAsyncData(
  `book-${bookId.value}`,
  async() => {
    const [orderItemsData, book] = await Promise.all([
      getOrderItems({ columns: 'orderId:order_id, orderItemStatus:status, orderItemComment:comment, orders(*)', bookId:bookId.value }),
      get(bookId.value)
    ]);

    return {orderItemsData, book}
  }
);

orderItems.value = data.value.orderItemsData.data.map(item => {
  return {
    orderId: item.orderId,
    orderItemComment: item.orderItemComment,
    orderItemStatus: item.orderItemStatus,
    orderCreatedAt: item.orders.created_at,
    orderReturnedAt: item.orders.returned_at
  }
});

title.value = data.value.book.data.title;
description.value = data.value.book.data.description;
quantity.value = data.value.book.data.quantity;
selectedPhoto.value = null;
imagePreview.value = data.value.book.data.coverImage;

selectedPublishers.value = data.value.book.data.publishers.map(publisher => Number(publisher.id));
selectedCategories.value = data.value.book.data.categories.map(category => Number(category.id));
selectedAuthors.value = data.value.book.data.authors.map(author => Number(author.id));

oldCategories.value = data.value.book.data.categories.map(category => Number(category.id));
oldAuthors.value = data.value.book.data.authors.map(author => Number(author.id));
oldPublishers.value = data.value.book.data.publishers.map(publisher => Number(publisher.id));
oldQuantity.value = data.value.book.data.quantity;

processItems(data.value.book.data.book_items);

const handleFileUpload = (file) => {
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

function updateItemStatus(status) {
  const oldTotal = pendingCounts.value + openingCounts.value + borrowingCounts.value + lostCounts.value;
  const newTotal = quantity.value;
  switch(status) {
    case BOOK_STATUS.PENDING:
      pendingCounts.value = Math.max(0, Math.min(newTotal, pendingCounts.value));
      openingCounts.value = newTotal - pendingCounts.value;
      break;
    case BOOK_STATUS.OPENING:
      openingCounts.value = Math.max(0, Math.min(newTotal, openingCounts.value));
      pendingCounts.value = newTotal - openingCounts.value;
      break;
    default:
      const difference = newTotal - oldTotal;
      pendingCounts.value = Math.max(0, pendingCounts.value + difference);
      openingCounts.value = Math.max(0, Math.min(newTotal - pendingCounts.value, openingCounts.value));
      break;
  }
}

function processItems (data: Array<Tables<'book_items'>>) {
  bookItems.value = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  pendingCounts.value = bookItems.value?.pending || 0;
  openingCounts.value = bookItems.value?.opening || 0;
  borrowingCounts.value = bookItems.value?.borrowing || 0;
  lostCounts.value = bookItems.value?.lost || 0;
}

const submitForm = async() => {
  let book = {
    id: bookId.value,
    title: title.value,
    description: description.value
  } as Tables<'books'>;

  if (selectedPhoto.value) {
    book = {
      ...book,
      cover_image: selectedPhoto.value
    }
  }

  await update(bookId.value, book)
    .then(async({ error }) => {
      if (error) throw error;

      //process book_authors
      if (JSON.stringify(oldAuthors.value) !== JSON.stringify(selectedAuthors.value)) {
        await deleteBooksAuthors(bookId.value)
          .then(async({ error:deleteBookAuthorErr }) => {
            if (deleteBookAuthorErr) throw deleteBookAuthorErr;

            const bookAuthors = selectedAuthors.value.map(author => ({
              author_id: author,
              book_id: bookId.value
            }));
            const { error:bookAuthorsError } = await insertBooksAuthors(bookAuthors);
            if (bookAuthorsError) throw bookAuthorsError;
          })
      }

      //process book_categories
      if (JSON.stringify(oldCategories.value) !== JSON.stringify(selectedCategories.value)) {
        await deleteBooksCategories(bookId.value)
          .then(async({ error: deletedBookCategoriesError }) => {
            if (deletedBookCategoriesError) throw deletedBookCategoriesError;

            const bookCategories = selectedCategories.value.map(category => ({
              book_id: bookId.value,
              category_id: category
            }));

            const { error:bookCategoriesError} = await insertBooksCategories(bookCategories);
            if (bookCategoriesError) throw bookCategoriesError;
          })
      }

      //process book_publishers
      if (JSON.stringify(oldPublishers.value) !== JSON.stringify(selectedPublishers.value)) {
        await deleteBooksPublishers(bookId.value)
          .then(async({ error: deletedBookPublishersError }) => {
            if (deletedBookPublishersError) throw deletedBookPublishersError;

            const bookPublishers = selectedPublishers.value.map(publisher => ({
              book_id: bookId.value,
              publisher_id: publisher
            }));

            const { error:bookPublisherError } = await insertBooksPublishers(bookPublishers);
            if (bookPublisherError) throw bookPublisherError;
          })
      }
    })
    .catch((error) => useToastError(error));

  //process book_items
  if (quantity.value > 0 && oldQuantity.value !== quantity.value) {
    const fixedCounts = Number(borrowingCounts.value) + Number(lostCounts.value);

    //new quantity is > old quantity => insert new item
    if (quantity.value > oldQuantity.value && quantity.value > fixedCounts) {
      const newItems = Number(quantity.value) - oldQuantity.value;
      const booksItemsData = Array.from({ length: newItems }, () => ({ book_id: bookId.value, status: BOOK_STATUS.PENDING }));
      await insertBooksItems(booksItemsData)
        .then(({ error }) => {
          if (error) throw error;
        });
    }

    //new quantity is < old quantity => remove only pending or new
    if (quantity.value < oldQuantity.value && quantity.value >= fixedCounts) {
      const removeCounts = oldQuantity.value - quantity.value;
      if (pendingCounts.value >= removeCounts) {
        await getBookItems({ columns:'id', bookIds: [bookId.value], status: [BOOK_STATUS.PENDING] })
          .order('id', {ascending:true})
          .limit(removeCounts)
          .then(async({ data, error }) => {
            if (error) throw error;

            if (data.length === 0) return;

            console.log('REMOVING pending Ids => ', data);
            const ids = data?.map(row => row.id);
            await deleteBookItems({ ids: ids })
              .then(({ error }) => {
                if (error) throw error;
              });
          })
          .catch((error) => useToastError(error));
      } else {
        const openingRemove = Number(removeCounts) - Number(pendingCounts.value);
        await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.PENDING})
          .then(async({ error }) => {
            if (error) throw error;
            await getBookItems({ columns:'id', bookIds: [bookId.value], status: [BOOK_STATUS.OPENING] })
              .order('id', {ascending:true})
              .limit(openingRemove)
              .then(async({ data:openingItems , error:getOpeningItemsError }) => {
                if (getOpeningItemsError) throw getOpeningItemsError;

                const ids = openingItems?.map(item => item.id);
                await deleteBookItems({ ids: ids })
                  .then(({ error }) => {
                    if (error) throw error;
                  });
              });
          })
          .catch((error) => useToastError(error));
      }
    }

    await getBookItems({columns: 'id,status', bookIds: [bookId.value]})
      .then(({ data, error }) => {
        if (error) throw error;

        console.log('getBookItems => ', data);
        processItems(data);
      });

    console.log('NEW BOOK ITEMS => ', bookItems.value);

    await update(bookId.value, { quantity: quantity.value })
      .then(({ error }) => {
        if (error) throw error;
      })
      .catch((error) => useToastError(error));
  }
  if (quantity.value > 0 && oldQuantity.value === quantity.value) {
    if (pendingCounts.value !== bookItems.value?.pending) {
      await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.PENDING})
        .then(async({ error }) => {
          if (error) throw error;
          const booksItemsData = Array.from({ length: pendingCounts.value }, () => ({ book_id: bookId.value, status: BOOK_STATUS.PENDING }));
          await insertBooksItems(booksItemsData)
            .then(({ error }) => {
              if (error) throw error;
            });
        })
        .catch((error) => useToastError(error))
        ;
    }

    if (openingCounts.value !== bookItems.value?.opening) {
      await deleteBookItems({ bookId: bookId.value, status: BOOK_STATUS.OPENING})
        .then(async({ error }) => {
          if (error) throw error;
          const booksItemsData = Array.from({ length: openingCounts.value }, () => ({ book_id: bookId.value, status: BOOK_STATUS.OPENING }));
          await insertBooksItems(booksItemsData)
            .then(({ error }) => {
              if (error) throw error;
            });
        })
        .catch((error) => useToastError(error))
        ;
    }
  }

  refresh();
  useToastSuccess();
}

const columns = [
  {
    accessorKey: 'orderId',
    header: 'Order No.',
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          to: `/admin/orders/${row.getValue('orderId')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        row.getValue('orderId')
      )
    }
  },
  {
    accessorKey: 'orderItemStatus',
    header: 'Status',
  },
  {
    accessorKey: 'orderCreatedAt',
    header: 'Ordered at',
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          to: `/admin/orders/${row.getValue('orderId')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        readableDateTime(row.getValue('orderCreatedAt'))
      )
    }
  },
  {
    accessorKey: 'orderReturnedAt',
    header: 'Returned at',
    cell: ({ row }) => {
      return h(
        NuxtLink,
        {
          to: `/admin/orders/${row.getValue('orderId')}`,
          class: 'hover:text-primary-700 cursor-pointer'
        },
        readableDateTime(row.getValue('orderReturnedAt'))
      )
    }
  },
];
</script>