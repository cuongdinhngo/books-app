import type { Tables } from '~/types/database.types';
interface GetOrderItemsOptions {
  columns?: string,
  id?: number,
  orderId?: number,
  bookItemId?: number,
  bookId?: number,
  status?: string,
  page?: number,
  size?: number,
  isNotDeleted?: null
}

const TABLE_NAME = 'order_items';

export const ORDER_ITEM_STATUS = {
  WAITING: 'waiting',
  BORROWING: 'borrowing',
  CLOSED: 'closed',
  UNAVAILABLE: 'unavailable',
  LOST: 'lost'
}

export const useOrderItems = () => {  

  const insert = (data: Tables<'order_items'>[]) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const upsert = (data: Tables<'order_items'>[]) => {
    return useTable(TABLE_NAME).upsert(data);
  }

  const index = (options: GetOrderItemsOptions = {}) => {
    const {
      columns = '*',
      id = null,
      orderId = null,
      bookItemId = null,
      bookId = null,
      status = null,
      page = null,
      size = null,
      isNotDeleted = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (id) {
      query = query.eq('id', id);
    }
    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    if (bookItemId) {
      query = query.eq('book_item_id', bookItemId);
    }
    if (bookId) {
      query = query.eq('book_id', bookId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (isNotDeleted) {
      query = query.is('deleted_at', null)
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const remove = (orderItemId: number) => {
    return useTable(TABLE_NAME).delete().eq('id', orderItemId);
  }

  const update = (orderItemId: number, data: Tables<'order_items'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', orderItemId);
  }

  return {
    index,
    insert,
    upsert,
    remove,
    update
  }
}