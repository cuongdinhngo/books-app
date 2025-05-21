import type { Tables } from '~/types/database.types';

interface ReviewOptions {
  columns?: string,
  id?: number,
  readerId?: number,
  bookId?: number,
  page?: number,
  size?: number,
  isHead?: Boolean
}

const TABLE_NAME = 'books_reviews';

export const useBooksReviews = () => {

  const index = (options: ReviewOptions = {}) => {
    const {
      columns = '*',
      id = null,
      readerId = null,
      bookId = null,
      page = null,
      size = null,
      isHead = false
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact', head: isHead }).order('created_at', { ascending: false });
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

  const insert = (data: Tables<'reviews'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  return {
    index,
    insert
  }
}