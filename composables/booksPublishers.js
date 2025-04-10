export const useBooksPublishers = () => {
  const bookPublisherModel = useSupabaseClient().from('books_publishers');

  const processBookPublisher = async(bookId, newData, oldData = null) => {
    try {
      if (oldData) {
        await deleteBookPublisher(bookId, oldData);
      }

      const { data, error: upsertError} = await bookPublisherModel.upsert(newData).select();
      if (upsertError) throw upsertError;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertBooksPublishers: ', err);
      return null;
    }
  }

  const deleteBookPublisher = async(bookId, publisherIds) => {
    const {status, error: deleteError} = await bookPublisherModel
      .delete()
      .eq('book_id', bookId)
      .in('publisher_id', publisherIds)
    ;
    if (deleteError) throw deleteError;
  }

  return {
    processBookPublisher
  }
}