<template>
  <div class="flex bg-white border-b-1 border-gray-200 pb-5 text-stone-900">
    <!-- Left Side: Book Cover -->
    <div class="w-1/5 flex items-center justify-center">
      <NuxtLink :to="{ name: 'book-id', params: { id: book.id } }">
        <img
          :src="book.cover_image"
          :alt="book.title"
          class="object-contain h-50 w-60"
        >
      </NuxtLink>
    </div>

    <!-- Right Side: Book Details -->
    <div class="w-2/3 p-6">
      <!-- Book Title -->
      <NuxtLink :to="{ name: 'book-id', params: { id: book.id } }">
        <h2 class="text-xl font-bold mb-4">{{ book.title }}</h2>
      </NuxtLink>
      <div class="flex space-x-6">
        <!-- First Column: Book ID, Reader Name -->
        <div class="w-1/2 space-y-2">
            <p>
              <span class="font-semibold mr-2">Book ID:</span>
              {{ bookCopyId }}
            </p>
            <p>
              <span class="font-semibold">Status:</span>
              <UBadge class="capitalize ml-2" variant="subtle" :color="mapBadgeColor(order.status)">
                {{ order.status }}
              </UBadge>
            </p>
        </div>
        <!-- Second Column: Ordered Date, Due Date, Returned Date -->
        <div class="w-1/2 space-y-2">
            <p>
              <span class="font-semibold">Ordered No:</span> #{{ props.order.id }}
            </p>
            <p>
              <span class="font-semibold">Ordered Date:</span> {{ useDateFormat(order.created_at, 'MMMM Do, YYYY') }}
            </p>
            <p>
              <span class="font-semibold">Due Date:</span> {{ order.due_date ? useDateFormat(order.due_date, 'MMMM Do, YYYY') : 'Waiting for approve' }}
            </p>
            <p>
              <span class="font-semibold">Returned Date:</span> {{ order.returned_at ? useDateFormat(order.returned_at, 'MMMM Do, YYYY') : 'No Information' }}
            </p>
        </div>
      </div>

      <!-- Action Selection and Timeline Button -->
      <div class="mt-4 flex items-center space-x-4">
        <UButton
          v-if="order.status === ORDER_STATUS.BORROWING"
          icon="lucide:notebook-pen" size="md" color="primary" variant="solid"
          @click="dueDateModal = true"
        >
          Extend due date
        </UButton>
        <UButton
          icon="lucide:audio-lines" size="md" color="primary" variant="solid"
          @click="timelineModal = true"
        >
          Timeline Detail
        </UButton>
      </div>
    </div>

    <!-- Extend Due date Modal -->
    <UModal
      :title="`#${props.order.id}: Extend Due date`"
      v-model:open="dueDateModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
    >
      <template #body>
        <div class="flex flex-col">
          <form @submit.prevent="extendDueDate">
            <UInput
              type="date"
              v-model="newDueDate"
            />
            <UTextarea
              v-model="dueDateComment"
              placeholder="Type something..." class="w-full my-5" variant="subtle"
            />
            <UButton
              icon="lucide:badge-check"
              label="Submit"
              size="md"
              color="primary"
              variant="subtle"
              class="text-right"
              @click="extendDueDate"
            />
          </form>
        </div>
      </template>
    </UModal>

    <!-- Order Timeline Modal -->
    <UModal
      :title="`#${props.order.id}: Timeline`"
      v-model:open="timelineModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full'}"
    >
      <template #body>
        <UStepper
          orientation="vertical"
          :items="timelineItems"
          :default-value="timelineItems.length"
          class="w-full"
        />
      </template>
    </UModal>

  </div>
</template>
<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui';
import { BOOK_COPY_STATUS } from '~/constants/bookCopies';
import { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES } from '~/constants/notifications';
import { ORDER_RENEWS_STATUS } from '~/constants/orderRenews';
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '~/constants/orders';
import { TIMELINE_ACTIONS, TIMELINE_TYPES } from '~/constants/orderTimeline';

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  book: {
    type: Object,
    required: true
  },
  bookCopies: {
    type: Array,
    required: true
  },
  orderRenews: {
    type: Array,
    required: true
  },
  timeline: {
    type: Array,
    required: true
  }
});

const dueDateModal = ref(false);
const newDueDate = ref('');
const dueDateComment = ref('');
const timelineModal = ref(false);

const { insert:sendNotification } = useNotifications();
const { insert:insertNewDueDate } = useOrderRenews();
const { insert:createOrderTimeline} = useOrderTimeline();
const { userId } = useAuth();

const timelineItems = computed(() => {
  return (props.timeline as StepperItem[]).map((item) => {
    const action = TIMELINE_ACTIONS.filter(action => item.action === action.type)[0];
    const description = action.description
      .replace('#dateTime', useDateFormat(item.created_at, ' HH:mm MMMM Do, YYYY').value)
      .replace('#staffName', item.users.name);
    
    return {
      ...action,
      description
    }
  });
});

const items = computed(() => {
  if (props.order.book_copy_id) {
    return [props.order.book_copy_id]
  }

  return props.bookCopies
    .filter((copy) => copy.status === BOOK_COPY_STATUS.OPENING)
    .map((copy) => copy.id);
});
const bookCopyId = ref(items.value[0]);

const extendDueDate = () => {
  const dueDate = {
    order_id: props.order.id,
    status: ORDER_RENEWS_STATUS.WAITING,
    new_due_date: newDueDate.value,
    old_due_date: props.order.due_date,
    request_note: dueDateComment.value
  }

  Promise.all([
    insertNewDueDate(dueDate)
  ])
  .then(async({ error }) => {
    if (error) throw error;

    const { error:notificationError } = await sendNotification(
      {
        type: NOTIFICATION_TYPES.REQUEST_EXTEND_DUE_DATE,
        message: NOTIFICATION_MESSAGES.REQUEST_EXTEND_DUE_DATE,
        notifiable_id: props.order.id,
        notifiable_type: 'orders'
      }
    );

    const { error:timelineError } = await createOrderTimeline(
      {
        order_id: props.order.id,
        action: TIMELINE_TYPES.ORDER_REQUEST_DUE_DATE,
        user_id: userId.value
      }
    );

    dueDateModal.value = false;
    newDueDate.value = '';
    dueDateComment.value = '';
    useToastSuccess(`You submitted the request of extending due date. Please waiting for confirmation!`);
  })
  .catch((error) => useToastError(error));
}
</script>