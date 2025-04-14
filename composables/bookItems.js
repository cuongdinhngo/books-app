export const useBookItems = () => {
  const supabase = useSupabaseClient();
  const bookItemModel = useSupabaseClient().from('book_items');

  const TABLE_NAME = 'book_items';
  const itemsPerPage = 5;
  const bookItems = useState('bookItems', () => []);
  const totalBookItems = useState('totalBookItems', () => 0);

  const insertBookItems = async(quantity, data) => {
    try {
      const items = Array.from({length: quantity}, () => ({
        ...data
      }));
      const { error } = await bookItemModel.insert(items);
      if (error) throw error;
    } catch(err) {
      console.error('[ERROR] FAILED bookItems insert: ', err);
    }
  }

  const getItemsByBookId = async(bookId, page = 1) => {
    try {
      let from = (page - 1) * itemsPerPage;
      let to = page * itemsPerPage - 1;
      const { data, error } = await bookItemModel
        .select()
        .eq('book_id', bookId)
        .limit(itemsPerPage)
        .range(from, to);
        ;
      if (error) throw error;
      if (data.length > 0) {
        bookItems.value = data;
        await getTotalBookItemCounts(bookId);
      }
    } catch(err) {
      console.error('[ERROR] FAILED getItemsByBookId: ', err);
    }
  }

  const getTotalBookItemCounts = async(bookId = null, status = null) => {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
      ;
      if (bookId) {
        query = query.eq('book_id', bookId);
      }
      if (status) {
        query = query.eq('status', status);
      }
      const { count, error } = await query;
      if (error) throw error

      totalBookItems.value = count;
    } catch(err) {
      console.log('[ERROR] bookItems::getTotalBookItemCounts -> ', err);
      totalBookItems.value = 0;
    }
  }

  const updateBookItemStatus = async(itemId, data) => {
    try {
      const {error} = await supabase.from('book_items').update(data).eq('id', itemId);
      if(error) throw error;
    } catch(err) {
      console.error('[ERROR] FAILED updateBookItemStatus: ', err);
    }
  }

  const updateBulk = async(data) => {
    try {
      const {error} = await supabase.from('book_items').upsert(data);
      if(error) throw error;
      return true;
    } catch(err) {
      console.error('[ERROR] FAILED updateBulk: ', err);
      return false;
    }
  }

  const deleteBookItem = async(itemId) => {
    try {
      const {error} = await supabase.from('book_items').delete().eq('id', itemId);
      if(error) throw error;
    } catch(err) {
      console.error('[ERROR] FAILED deleteBookItem: ', err);
    }
  }

  const getBookInfoByItemIds = async(itemIds) => {
    try {
      const {data, error} = await supabase.from('book_items')
        .select(`
          bookItemId:id,
          book_id,
          books(id,title,cover_image)
        `)
        .in('id', itemIds)
      ;
      if(error) throw error;

      return data;
    } catch(err) {
      console.error('[ERROR] getBookInfoByItemIds: ', err);
      return []
    }
  }

  return {
    bookItems,
    totalBookItems,
    itemsPerPage,
    insertBookItems,
    getItemsByBookId,
    updateBookItemStatus,
    deleteBookItem,
    getTotalBookItemCounts,
    updateBulk,
    getBookInfoByItemIds
  }
}