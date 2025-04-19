import type {Tables} from '~/types/database.types'

const TABLE_NAME = 'books_categories';
export const useBooksCategories = () => {

  const insertBooksCategories = (data: Tables<'books_categories'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const deleteBooksCategories = (bookId: number) => {
    return useTable(TABLE_NAME).delete().eq('book_id', bookId);
  }

  return {
    insertBooksCategories,
    deleteBooksCategories
  }
}