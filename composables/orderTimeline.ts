import type { OrderTimelineOptions } from "~/types/options";

const TABLE_NAME = 'order_timeline';
const { insert, get, update, remove } = useCrud(TABLE_NAME);

export const useOrderTimeline = () => {

  const index = (options: OrderTimelineOptions = {}) => {
    const {
      columns = '*',
      id = null,
      orderId = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, {count: 'exact'}).order('created_at', { ascending: false });
    if (id) {
      query = query.eq('id', id);
    }
    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    return query;
  }

  return {
    index,
    insert,
    get,
    update,
    remove
  };
}
