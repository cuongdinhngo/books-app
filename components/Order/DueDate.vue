<template>
  <UTable
    v-if="orderRenews?.count > 0"
    :data="orderRenews?.data"
    :columns="columns"
    class="flex-1"
  >
  
  <template #actions-cell="{ row }">
    <div class="flex space-x-4">
      <UButton
        icon="lucide:badge-check"
        size="md"
        color="primary"
        variant="subtle"
        v-if="row.original.approved_by === null"
        @click="handleApprove(row.original.id, row.original.new_due_date, row.original.reader_id)"
      >
        Approve
      </UButton>
    </div>
  </template>

  </UTable>
</template>
<script setup lang="ts">
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from '~/constants/notifications';
import { useRouteParams } from '@vueuse/router';

const orderId = useRouteParams('id', null, { transform: Number }) 
const { index, update } = useOrderRenews();
const { userId } = useAuth();
const { update:updateOrder } = useOrders();
const { insert:insertNotification } = useNotifications();

const { data:orderRenews, error, refresh } = await useAsyncData(
  `order-${orderId.value}`,
  () => index({
    columns: 'id,reader_id,new_due_date,approved_by,comment,request_note,created_at,users(id,fullName:full_name)',
    orderId: orderId.value
  })
);

async function handleApprove(orderRenewId: number, newDueDate: string, readerId: string) {
  await update(orderRenewId, {
    id: orderRenewId,
    new_due_date: newDueDate,
    approved_by: userId.value
  })
    .then(async({error}) => {
      if (error) throw error;

      const { error:updateOrderError } = await updateOrder(orderId.value, { due_date: newDueDate });
      if (updateOrderError) throw updateOrderError;

      const { error:notificationErro } = await insertNotification({
        reader_id:readerId,
        type: NOTIFICATION_TYPES.APPROVED_EXTEND_DUE_DATE,
        message: NOTIFICATION_MESSAGES.APPROVED_EXTEND_DUE_DATE,
        notifiable_id: orderId.value,
        notifiable_type: 'orders'
      });

      useToastSuccess();
      refresh();
    })
    .catch((error) => useToastError(error));
}

console.log('ORDER RENEWS => ', orderRenews);

const columns = [
  {
    accessorKey: 'created_at',
    header: 'Requested Date',
    cell: ({ row }) => useDateFormat(row.original.created_at, 'MMMM Do, YYYY').value
  },
  {
    accessorKey: 'new_due_date',
    header: 'Due date',
    cell: ({ row }) => useDateFormat(row.original.new_due_date, 'MMMM Do, YYYY').value
  },
  {
    accessorKey: 'approved_by',
    header: 'Approved by',
    cell: ({ row }) => row.original.users?.fullName
  },
  {
    header: '',
    id: 'actions'
  },
];
</script>