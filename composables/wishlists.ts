import type { WishlistOptions } from '~/types/options';

const TABLE_NAME = 'wishlists';
const { insert, update, get, remove } = useCrud(TABLE_NAME);

export const useWishlists = () => {
  const index = (options: WishlistOptions = {}) => {
    const {
      columns = '*',
      id = null,
      readerId = null,
      bookId = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count:'exact' }).order('created_at', { ascending: false });
    if (id) {
      query = query.eq('id', id);
    }
    if (readerId) {
      query = query.eq('reader_id', readerId);
    }
    if (bookId) {
      query = query.eq('book_id', bookId);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  return {
    index,
    insert,
    update,
    get,
    remove
  }
}