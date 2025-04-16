export const useBooks = () => {
  const supabase = useSupabaseClient();
  const bookModel = useSupabaseClient().from('books');
  const { uploadPhoto, deletePhoto } = useImages('books');
  const { totalBookItems, getTotalBookItemCounts } = useBookItems();
  
  const TABLE_NAME = 'books';
  const perPage = 12;
  const books = ref([]);
  const totalBooks = useState('totalBooks', () => 0);
  const searchTerm = useState('searchTerm', () => {});
  const isLoading = useState('isLoading', () => false);
  const book = useState('book', () => null);

  const processBook = async(bookData) => {
    try {
      if (bookData.cover_image) {
        const uploadedImage = await uploadPhoto(bookData.cover_image, TABLE_NAME);
        if (uploadedImage) {
          bookData.cover_image = uploadedImage;
        }
      }

      const { data, error} = await bookModel.upsert(bookData).select().single();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertBook: ', err);
      return null;
    }
  }

  const getBooksByIds = async(bookIds) => {
    try {
      const { data, error: fetchError } = await bookModel
        .select(`
          id,
          title,
          coverImage:cover_image,
          authors (id, name:full_name)
        `)
        .in('id', bookIds)
      ;

      if (fetchError) throw fetchError;

      books.value = data;
    } catch(err) {
      console.log('[ERROR] getBookById: ', err);
      books.value = [];
    }
  }

  const getBookById = async(bookId, bookItemStatus = null) => {
    try {
      const { data, error: fetchError } = await bookModel
        .select(`
          bookId:id,
          title,
          description,
          coverImage:cover_image,
          quantity,
          publishers (id, name),
          authors (id, name:full_name),
          categories (id, name)
        `)
        .eq('id', bookId)
        .single()
      ;

      if (fetchError) throw fetchError;

      await getTotalBookItemCounts(bookId, bookItemStatus);

      book.value = data;
      book.value.bookItemCounts = totalBookItems.value;
    } catch(err) {
      console.log('[ERROR] getBookById: ', err);
      book.value = null;
    }
  }

  const getTotalBookCounts = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      totalBooks.value = count;
      return count;
    } catch(err) {
      console.log('[ERROR] getTotalBookCounts: ', err);
      totalBooks.value = 0;
      return 0;
    }
  }

  const searchBook = async(searchQuery = null, page = 1) => {
    try {
      searchQuery = searchQuery && filterEmptyValues(searchQuery);
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      let selectCols = [
        'bookId:id',
        'title',
        'coverImage:cover_image',
        'quantity',
        `publishers (id, name)`,
        `authors (id, name:full_name)`,
        `categories (id, name)`
      ];
      let query = supabase.from(TABLE_NAME).select();

      if (searchQuery?.title) {
        query = query.ilike('title', `%${searchQuery.title}%`);
      }
      if (searchQuery?.publisherIds) {
        selectCols.push('books_publishers!inner(publisher_id)');
        query = query.in('books_publishers.publisher_id', searchQuery.publisherIds);
      }
      if (searchQuery?.authorIds) {
        selectCols.push('books_authors!inner(author_id)');
        query = query.in('books_authors.author_id', searchQuery.authorIds);
      }
      if (searchQuery?.categoryIds) {
        selectCols.push('books_categories!inner(category_id)');
        query = query.in('books_categories.category_id', searchQuery.categoryIds);
      }

      const { data, error: searchError } = await query
        .select(`${selectCols.join(',')}`)
        .limit(perPage)
        .range(from, to);
      ;
      if (searchError) throw searchError;

      books.value = data;
      if (searchQuery && Object.entries(searchQuery).length > 0) {
        totalBooks.value = data.length;
      } else {
        await getTotalBookCounts();
      }
    } catch(err) {
      console.log('[ERROR] searchBook: ', err);
      books.value = [];
    }
  }

  return {
    book,
    books,
    isLoading,
    totalBooks,
    perPage,
    getBookById,
    processBook,
    searchBook,
    searchTerm,
    getBooksByIds,
    getTotalBookCounts
  }
}