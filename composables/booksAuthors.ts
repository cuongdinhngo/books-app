import type { Tables } from '~/types/database.types';

const TABLE_NAME = 'books_authors';
export const useBooksAuthors = () => {

  const insert = (data: Tables<'books_authors'>[] = []) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const remove = (bookId: number) => {
    return useTable(TABLE_NAME)
      .delete()
      .eq('book_id', bookId)
    ;
  }

  return {
    insert,
    remove
  }
}