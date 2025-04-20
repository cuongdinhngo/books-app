import type { Tables } from '~/types/database.types';
interface GetOrderItemsOptions {
  columns?: string,
  id?: number,
  orderId?: number,
  bookItemId?: number,
  status?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'order_items';
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
      status = null,
      page = null,
      size = null
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
    if (status) {
      query = query.eq('status', status);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  return {
    index,
    insert,
    upsert
  }
}