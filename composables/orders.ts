import type { Tables } from '~/types/database.types';interface GetOrdersOptions {
  columns?: string,
  id?: number,
  readerId?: string,
  status?: (string)[],
  from?: string,
  to?: string,
  isOverdue?: boolean,
  isHead?: boolean,
  page?: number,
  size?: number
}

export const ORDER_STATUS = {
  WAITING: 'waiting',
  BORROWING: 'borrowing',
  CLOSE: 'closed',
  REJECT: 'rejected',
  OVERDUE: 'overdue'
};

export const ORDER_STATUS_OPTIONS = [
  {label: 'Close', id: 'closed'},
  {label: 'Borrowing', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'},
  {label: 'Reject', id: 'rejected'},
  {label: 'Overdue', id: 'overdue'},
];

export const BORROWING_PERIOD = 7;

const TABLE_NAME = 'orders';
const RENEW_TABLE_NAME = 'order_renews';

export const useOrders = () => {

  const index = (options: GetOrdersOptions = {}) => {
    let {
      columns = '*',
      id = null,
      readerId = null,
      status = [],
      from = null,
      to = null,
      isOverdue = false,
      isHead = false,
      page = null,
      size = null
    } = options;

    if (status.includes(ORDER_STATUS.OVERDUE)) {
      isOverdue = true;
      status = status.filter(value => value !== ORDER_STATUS.OVERDUE);
    }
    let query = useTable(TABLE_NAME).select(columns, { count: 'exact', head: isHead }).order('created_at', { ascending: false });
    if (id) {
      query = query.eq('id', id);
    }
    if (readerId) {
      query = query.eq('reader_id', readerId);
    }
    //overdue filter requires that status must be borrowing
    if (isOverdue) {
      status = [ORDER_STATUS.BORROWING];
      query = query.lt('due_date', new Date().toISOString());
    }
    if (status && status.length > 0) {
      query = query.in('status', status);
    }
    if (from) {
      let rangeTo = new Date().toLocaleDateString('sv-SE').split('T')[0];
      if (to) rangeTo = to;
      query = query.gte('created_at', from).lte('created_at', rangeTo);
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

  const get = async(orderId: number, columns: string = '*') => {
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

  const renew = (data: Tables<'order_renews'>) => {
    return useTable(RENEW_TABLE_NAME).insert(data);
  }
  
  return {
    update,
    index,
    insert,
    get,
    getOrdersByReaderId,
    renew
  }
}