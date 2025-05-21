import type { Tables } from '~/types/database.types';
import type { OrderOptions } from '~/types/options';
import { ORDER_STATUS } from '~/constants/orders';

const TABLE_NAME = 'orders';
const RENEW_TABLE_NAME = 'order_renews';

const { insert, update, get, remove } = useCrud(TABLE_NAME);

export const useOrders = () => {

  const index = (options: OrderOptions = {}) => {
    let {
      columns = '*',
      id = null,
      readerId = null,
      status = [],
      bookId = null,
      bookCopyId = null,
      from = null,
      to = null,
      isOverdue = false,
      isHead = false,
      createdAt = null,
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
    if (bookId) {
      query = query.eq('book_id', bookId);
    }
    if (bookCopyId) {
      query = query.eq('book_copy_id', bookCopyId);
    }
    if (createdAt) {
      query = query.eq('created_at', createdAt);
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

  const renew = (data: Tables<'order_renews'>) => {
    return useTable(RENEW_TABLE_NAME).insert(data);
  }
  
  return {
    update,
    index,
    insert,
    get,
    renew
  }
}