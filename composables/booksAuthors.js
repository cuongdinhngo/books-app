export const useBooksAuthors = () => {
  const supabase = useSupabaseClient();
  const bookAuthorModel = useSupabaseClient().from('books_authors');
  const TABLE_NAME = 'books_authors';

  const processBookAuthor = async(bookId, newData, oldData = null) => {
    try {
      if (oldData) {
        await deleteBookAuthor(bookId, oldData);
      }

      const { data, error: upsertError} = await bookAuthorModel.upsert(newData).select();
      if (upsertError) throw upsertError;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertBooksAuthors: ', err);
      return null;
    }
  }

  const deleteBookAuthor = async(bookId, authorIds) => {
    const {status, error: deleteError} = await bookAuthorModel
      .delete()
      .eq('book_id', bookId)
      .in('author_id', authorIds)
    ;
    if (deleteError) throw deleteError;
  }

  return {
    processBookAuthor
  }
}