import type { Tables } from '~/types/database.types';

interface Order {
  id?: Number,
  reader_id?: String,
  approved_by?: String,
  status?: String,
  created_at?: String,
  updated_at?: String
}

interface GetOrdersOptions {
  columns?: string,
  id?: number,
  readerId?: number,
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

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact'});
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

  const getAllOrders = async(status?: String) => {
    try {
      isLoading.value = true;
      let query = supabase.from(TABLE_NAME)
        .select(`
          id,
          status,
          readers(id, fullName:full_name)
        `)
      ;
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (error) throw error;

      orders.value = data;
      if (status) {
        totalOrderCounts.value = data.length;
      } else {
        await getTotalOrderCounts();
      }
      isLoading.value = false;
    } catch(err) {
      console.error('[ERRO] addNewOrder: ', err);
      orders.value = [];
      isLoading.value = false;
    }
  }

  const getTotalOrderCounts = async(status = null) => {
    try {
      let query = supabase.from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });
      if (status) {
        query = query.eq('status', status);
      }

      const { count, error } = await query;
      if (error) throw error;

      totalOrderCounts.value = count;
      return count;
    } catch(err) {
      console.log('[ERROR] getTotalOrderCounts: ', err);
      totalOrderCounts.value = 0;
      return 0;
    }
  }

  const addNewOrder = async(orderData: Order) => {
    try {
      const { error } = await supabase.from(TABLE_NAME).insert(orderData);
      if (error) throw error;

      return true;
    } catch(err) {
      console.error('[ERRO] addNewOrder: ', err);
      return false;
    }
  }

  const getNewestOrderByReader = async(readerId: String) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select()
        .eq('reader_id', readerId)
        .order('id', { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      
      return data;
    } catch(err) {
      console.error('[ERRO] addNewOrder: ', err);
    }
  }

  const updateOrderStatus = async(orderId: Number, orderData: Order) => {
    try {
      const { error } = await supabase.from(TABLE_NAME)
        .update(orderData)
        .eq('id', orderId)
      ;
      if (error) throw error;

      return true;
    } catch(err) {
      console.error('[ERRO] updateOrderStatus: ', err);
      return false;
    }
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
    addNewOrder,
    getNewestOrderByReader,
    getAllOrders,
    updateOrderStatus,
    getOrderById,
    getTotalOrderCounts,
    getOrdersByReaderId
  }
}