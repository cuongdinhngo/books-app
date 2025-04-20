import type { Tables } from '~/types/database.types';interface GetOrdersOptions {
  columns?: string,
  id?: number,
  readerId?: string,
  status?: (string)[],
  page?: number,
  size?: number
}

const TABLE_NAME = 'orders';
export const useOrders = () => {

  const index = (options: GetOrdersOptions = {}) => {
    const {
      columns = '*',
      id = null,
      readerId = null,
      status = [],
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact'}).order('created_at', { ascending: false });
    if (id) {
      query = query.eq('id', id);
    }
    if (readerId) {
      query = query.eq('reader_id', readerId);
    }
    if (status && status.length > 0) {
      query = query.in('status', status);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const update = (orderId: number, data: Tables<'orders'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', orderId);
  }

  const insert = (data: Tables<'orders'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const getOrderById = async(orderId: number, columns: string = '*') => {
    return useTable(TABLE_NAME).select(columns).eq('id', orderId).single();
  }

  const getOrdersByReaderId = async(readerId: Number) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          status,
          created_at,
          order_items(count)
        `)
        .eq('reader_id', readerId)
      ;
      if (error) throw error;

      return data;
    } catch(err) {
      console.error('[ERRO] getOrderById: ', err);
      return [];
    }
  }
  
  return {
    update,
    index,
    insert,
    getOrderById,
    getOrdersByReaderId
  }
}