export const TIMELINE_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_APPROVED: 'order_approved',
  ORDER_REJECTED: 'order_rejected',
  ORDER_CLOSED: 'order_closed',
  ORDER_EXTENDED: 'order_extended',
  ORDER_REQUEST_DUE_DATE: 'order_request_due_date',
  ORDER_REQUEST_REJECTED: 'order_request_rejected',
  ORDER_REQUEST_APPROVED: 'order_request_approved',
};

export const TIMELINE_ACTIONS = [
  {
    type: TIMELINE_TYPES.ORDER_CREATED,
    title: 'Order was created',
    description: 'Created at #dateTime',
    icon: 'lucide:book-plus'
  },
  {
    type: TIMELINE_TYPES.ORDER_APPROVED,
    title: 'Order was approved',
    description: 'Approved at #dateTime',
    icon: 'lucide:book-check'
  },
  {
    type: TIMELINE_TYPES.ORDER_REJECTED,
    title: 'Order was rejected',
    description: 'Rejected at #dateTime',
    icon: 'lucide:book-x'
  },
  {
    type: TIMELINE_TYPES.ORDER_CLOSED,
    title: 'Order was closed',
    description: 'Closed at #dateTime',
    icon: 'lucide:book-lock'
  },
  {
    type: TIMELINE_TYPES.ORDER_EXTENDED,
    title: 'Due date was extended',
    description: 'Extended at #dateTime',
    icon: 'lucide:book-up'
  },
  {
    type: TIMELINE_TYPES.ORDER_REQUEST_DUE_DATE,
    title: 'Request due date was created',
    description: 'Sent at #dateTime',
    icon: 'lucide:book-up'
  },
  {
    type: TIMELINE_TYPES.ORDER_REQUEST_REJECTED,
    title: 'Request due date was approved',
    description: 'Approved at #dateTime',
    icon: 'lucide:book-check'
  },
];