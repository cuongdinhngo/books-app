import type { Tables } from '~/types/database.types';

export interface NotificationOptions {
  column?: string,
  id?: number,
  readerId?: string,
  type?: string,
  isRead?: boolean,
  notifiableId?: number,
  notifiableType?: string,
  page?: number,
  size?: number
}

export const NOTIFICATION_TYPES = {
  ORDER_OVERDUE: 'order_overdue',
  BOOK_WISHLIST: 'book_wishlist',
  REQUEST_EXTEND_DUE_DATE: 'request_extend_due_date',
  APPROVED_EXTEND_DUE_DATE: 'approved_extend_due_date',
}

export const NOTIFICATION_MESSAGES = {
  ORDER_OVERDUE: 'Your order #{orderId} is overdue. Please check it and return the books soon!',
  BOOK_WISHLIST: 'Your book is available. Please make an order soon!',
  REQUEST_EXTEND_DUE_DATE: 'A request is to extend due date. Please check it!',
  APPROVED_EXTEND_DUE_DATE: 'Your request of extending due date was approved'
}

const TABLE_NAME = 'notifications';

export const useNotifications = () => {
  
  const index = (options: NotificationOptions = {}) => {
    const {
      column = '*',
      id = null,
      readerId = null,
      type = null,
      isRead = null,
      notifiableId = null,
      notifiableType = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(column, { count: 'exact'});

    if (id) {
      query = query.eq('id', id);
    }
    if (readerId) {
      query = query.eq('reader_id', readerId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (isRead) {
      query = query.eq('is_read', isRead);
    }
    if (notifiableId && notifiableType) {
      query = query.match({ notifiable_id: notifiableId, notifiable_type: notifiableType });
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1)
    }

    return query;
  }

  const update = (id: number, data: Tables<'notifications'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', id);
  }

  const insert = (data: Tables<'notifications'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  return {
    index,
    update,
    insert
  }
}