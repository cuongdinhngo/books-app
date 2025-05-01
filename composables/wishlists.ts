import type { Tables } from '~/types/database.types';

interface WishlistOptions {
  columns?: string,
  id?: number,
  readerId?: number,
  bookId?: number,
  page?: number,
  size?: number
}

const TABLE_NAME = 'wishlists';

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

  const insert = (data: Tables<'wishlists'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const upsert = (data: Tables<'wishlists'>) => {
    return useTable(TABLE_NAME).upsert(data);
  }

  return {
    index,
    insert,
    upsert
  }
}