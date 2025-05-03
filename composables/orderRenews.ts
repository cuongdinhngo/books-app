import type { Tables } from '~/types/database.types';

interface OrderRenewOptions {
  columns?: string,
  orderId?: number,
  readerId?: string,
  isHead?: boolean
}

const TABLE_NAME = 'order_renews'
export const useOrderRenews = () => {

  const index = (options: OrderRenewOptions = {}) => {
    const {
      columns = '*',
      orderId = null,
      readerId = null,
      isHead = false
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact', head: isHead }).order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    if (readerId) {
      query = query.eq('reader_id', readerId);
    }

    return query;
  }

  const insert = (data: Tables<'order_renews'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const update = (id: number, data: Tables<'order_renews'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', id);
  }

  return {
    index,
    insert,
    update
  }
}