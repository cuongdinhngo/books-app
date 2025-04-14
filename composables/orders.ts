interface Order {
  id?: Number,
  reader_id?: String,
  approved_by?: String,
  status?: String,
  created_at?: String,
  updated_at?: String
}

interface UseOrderOptions {
  perPage?: Number
}

export const useOrders = (options: UseOrderOptions = {}) => {
  const { perPage = 10 } = options;

  const supabase = useSupabaseClient();
  const isLoading = useState('isLoading', () => false);
  const error = useState('error', () => '');
  const TABLE_NAME = 'orders';
  
  const order = useState('order', () => null);
  const orders = useState<Array<any>>('orders', () => []);
  const totalOrderCounts = useState<Number|null>('totalOrderCounts', () => 0);

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

  const getOrderById = async(orderId: Number) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          status,
          readers(id, fullName:full_name),
          order_items(*)
        `)
        .eq('id', orderId)
        .single()
      ;
      if (error) throw error;

      order.value = data;
    } catch(err) {
      console.error('[ERRO] getOrderById: ', err);
      order.value = null;
    }
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
    order,
    orders,
    isLoading,
    error,
    perPage,
    addNewOrder,
    getNewestOrderByReader,
    getAllOrders,
    totalOrderCounts,
    updateOrderStatus,
    getOrderById,
    getTotalOrderCounts,
    getOrdersByReaderId
  }
}