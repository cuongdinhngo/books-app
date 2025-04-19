import type { Tables } from '~/types/database.types';

const TABLE_NAME = 'books_authors';
export const useBooksAuthors = () => {

  const insertBooksAuthors = async(data: Tables<'books_authors'>[] = []) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const deleteBooksAuthors = async(bookId: number) => {
    return useTable(TABLE_NAME)
      .delete()
      .eq('book_id', bookId)
    ;
  }

  return {
    insertBooksAuthors,
    deleteBooksAuthors
  }
}