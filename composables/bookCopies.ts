interface GetBookItemsOptions {
  columns?: string,
  ids?: (number)[],
  bookIds?: (number)[],
  status?: (string)[],
  page?: number,
  size?: number
}

const TABLE_NAME = 'book_copies';

const { insert, update } = useCrud(TABLE_NAME);

export const useBookCopies = () => {

  const index = (options: GetBookItemsOptions = {}) => {
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

  return {
    insert,
    index,
    update
  }
}