export const useBooksCategories = () => {
  const supabase = useSupabaseClient();
  const bookCategoryModel = useSupabaseClient().from('books_categories');
  const TABLE_NAME = 'books_categories';

  const processBookCategory = async(bookId, newData, oldData = null) => {
    try {
      if (oldData) {
        await deleteBookCategory(bookId, oldData);
      }

      const { data, error: upsertError} = await bookCategoryModel.upsert(newData).select();
      if (upsertError) throw upsertError;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertBooksCategories: ', err);
      return null;
    }
  }

  const deleteBookCategory = async(bookId, categoryIds) => {
    const {status, error: deleteError} = await bookCategoryModel
      .delete()
      .eq('book_id', bookId)
      .in('category_id', categoryIds)
    ;
    if (deleteError) throw deleteError;
  }

  return {
    processBookCategory
  }
}