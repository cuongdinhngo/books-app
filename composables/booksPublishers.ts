
import type { Tables } from '~/types/database.types';
const TABLE_NAME = 'books_publishers';
export const useBooksPublishers = () => {

  const remove = (bookId: number) => {
    return useTable(TABLE_NAME).delete().eq('book_id', bookId);
  }

  const insert = (data: Tables<'books_publishers'>) => {
    return useTable(TABLE_NAME).insert(data)
  }

  return {
    remove,
    insert
  }
}