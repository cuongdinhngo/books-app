interface OrderItems {
  id?: Number,
  order_id?: Number,
  book_item_id?: Number,
  status?: String,
  created_at?: String,
  updated_at?: String
}

export const useOrderItems = () => {
  const supabase = useSupabaseClient();
  const TABLE_NAME = 'order_items';

  const orderItems = useState('orderItems', () => []);
  const totalOrderItemCounts = useState<Number|null>('totalOrderItemCounts', () => null);
  
  const addOrderItems = async(orderItemsData: Array<OrderItems>) => {
    try {
      const {error} = await supabase.from(TABLE_NAME).insert(orderItemsData);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] addOrderItems: ', err);
      return false;
    }
  }

  const updateOrderItems = async(orderItems: Array<OrderItems>) => {
    try {
      const {error} = await supabase.from(TABLE_NAME)
        .upsert(orderItems);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] updateOrderItems: ', err);
      return false;
    }
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

  return {
    orderItems,
    addOrderItems,
    updateOrderItems,
    getOrderItemsByOrderId,
    getTotalOrderItemCounts
  }
}