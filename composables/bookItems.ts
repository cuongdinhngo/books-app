import type { Tables } from '~/types/database.types';

interface GetBookItemsOptions {
  columns?: string,
  ids?: (number)[],
  bookIds?: (number)[],
  status?: (string)[],
  page?: number,
  size?: number
}

export const bookStatus = [
  {
    label: 'Pending',
    id: 'pending'
  },
  {
    label: 'Opening',
    id: 'opening'
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

export const BOOK_ITEM_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost',
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available'
};

const TABLE_NAME = 'book_items';

const { insert, update } = useCrud(TABLE_NAME);

export const useBookItems = () => {

  const index = (options: GetBookItemsOptions = {}) => {

    console.log('BOOK ITEM OPTIONS => ', options);
    const {
      columns = '*',
      ids = [],
      bookIds = [],
      status = [],
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, {count: 'exact'}).order('id', { ascending: false });

    if (ids.length > 0) {
      query = query.in('id', ids);
    }
    if (bookIds && bookIds.length >= 1) {
      query = query.in('book_id', bookIds);
    }
    if (status && status.length >= 1) {
      query = query.in('status', status);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const remove = (options: GetBookItemsOptions = {}) => {
    const {
      ids = [],
      bookId = null,
      status = null
    } = options;
    let query = useTable(TABLE_NAME).delete();
    if (ids && ids.length > 0) {
      query = query.in('id', ids);
    }
    if (bookId) {
      query = query.eq('book_id', bookId);
    }
    if (status) {
      query = query.eq('status', status);
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