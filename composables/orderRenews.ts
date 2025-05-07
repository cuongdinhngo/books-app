import type { Tables } from '~/types/database.types';
import type { OrderRenewOptions } from '~/types/options';

const TABLE_NAME = 'order_renews'

const { insert, update } = useCrud(TABLE_NAME);

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

  return {
    index,
    insert,
    update
  }
}