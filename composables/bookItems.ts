import type { Tables } from '~/types/database.types';

interface GetBookItemsOptions {
  columns?: string,
  ids?: (number)[],
  bookId?: number,
  status?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'book_items';
export const useBookItems = () => {

  const insertBooksItems = (data: Tables<'book_items'>[]) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const getBooksItems = (options: GetBookItemsOptions = {}) => {
    const {
      columns = '*',
      ids = [],
      bookId = null,
      status = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, {count: 'exact'});

    if (ids.length > 0) {
      query = query.in('id', ids);
    }
    if (bookId) {
      query = query.eq('book_id', bookId);
    }
    if (status) {
      query = query.ilike('status', `%${status}%`);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const updateBookItemStatus = async(itemId: number, data: Tables<'book_items'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', itemId);
  }

  const deleteBookItems = (options: GetBookItemsOptions = {}) => {
    const {
      ids = [],
      bookId = null
    } = options;
    let query = useTable(TABLE_NAME).delete();
    if (ids && ids.length > 0) {
      query = query.in('id', ids);
    }
    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    return query;
  }

  const upsertBookItems = (data: Tables<'book_items'>[]) => {
    return useTable(TABLE_NAME).upsert(data);
  }

  return {
    insertBooksItems,
    getBooksItems,
    updateBookItemStatus,
    deleteBookItems,
    upsertBookItems
  }
}