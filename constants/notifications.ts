export const NOTIFICATION_TYPES = {
  NEW_ORDER: 'new_order',

  ORDER_APPROVED: 'order_approved',
  ORDER_REJECTED: 'order_rejected',
  ORDER_CLOSED: 'order_closed',
  ORDER_OVERDUE: 'order_overdue',

  BOOK_WISHLIST: 'book_wishlist',

  REQUEST_EXTEND_DUE_DATE: 'request_extend_due_date',
  APPROVED_EXTEND_DUE_DATE: 'approved_extend_due_date',
}

export const NOTIFICATION_MESSAGES = {
  NEW_ORDER: 'You have a new order. Please check it!',

  ORDER_OVERDUE: 'Your order #{orderId} is overdue. Please check it and return the books soon!',
  ORDER_REJECTED: 'Your order #{orderId} was rejected. Please check it!',
  ORDER_APPROVED: 'Your order #{orderId} was approved. Please check it!',
  ORDER_CLOSED: 'Your order #{orderId} was closed. Please check it!',

  BOOK_WISHLIST: 'Your book is available. Please make an order soon!',

  REQUEST_EXTEND_DUE_DATE: 'A request is to extend due date. Please check it!',
  APPROVED_EXTEND_DUE_DATE: 'Your request of extending due date was approved'
}
