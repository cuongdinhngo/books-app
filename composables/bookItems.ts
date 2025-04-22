import type { Tables } from '~/types/database.types';

interface GetBookItemsOptions {
  columns?: string,
  ids?: (number)[],
  bookId?: number,
  status?: string,
  page?: number,
  size?: number
}

export const bookStatus = [
  {
    label: 'Pending',
    id: 'pending'
  },
  {
    label: 'Open',
    id: 'open'
  },
  {
    label: 'Borrowed',
    id: 'borrowed'
  },
  {
    label: 'Borrowing',
    id: 'borrowing'
  },
  {
    label: 'Lost',
    id: 'lost'
  }
];

const TABLE_NAME = 'book_items';
export const useBookItems = () => {

  const insert = (data: Tables<'book_items'>[]) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const index = (options: GetBookItemsOptions = {}) => {
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

  const update = async(itemId: number, data: Tables<'book_items'>) => {
    return useTable(TABLE_NAME).update(data).eq('id', itemId);
  }

  const remove = (options: GetBookItemsOptions = {}) => {
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

  const upsert = (data: Tables<'book_items'>[]) => {
    return useTable(TABLE_NAME).upsert(data);
  }

  return {
    insert,
    index,
    update,
    remove,
    upsert
  }
}