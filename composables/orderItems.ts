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

  const addOrderItems = (data: Tables<'order_items'>[]) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const upsertOrderItems = (data: Tables<'order_items'>[]) => {
    return useTable(TABLE_NAME).upsert(data);
  }

  const getOrderItemsByOrderId = async(orderId: Number) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select()
        .eq('order_id', orderId)
      ;
      if (error) throw error;

      orderItems.value = data;
    } catch(err) {
      console.log('[ERROR] getOrderItemsByOrderId: ', err);
      orderItems.value = [];
    }
  }

  const getTotalOrderItemCounts = async(status: String = '') => {
    try {
      let query = supabase.from(TABLE_NAME).select('*', { count: 'exact', head: true });
      if (status.length > 0) {
        query = query.eq('status', status);
      }
      const { count, error } = await query;

      if (error) throw error;

      totalOrderItemCounts.value = count;
      return count;
    } catch(err) {
      console.log('[ERROR] getTotalOrderItemCounts: ', err);
      totalOrderItemCounts.value = 0;
      return 0;
    }
  }

  const getOrderItems = (options: GetOrderItemsOptions = {}) => {
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
    getOrderItems,
    addOrderItems,
    upsertOrderItems,
    getOrderItemsByOrderId,
    getTotalOrderItemCounts
  }
}