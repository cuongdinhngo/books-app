export const useBooks = () => {
  const supabase = useSupabaseClient();
  const bookModel = useSupabaseClient().from('books');
  const { uploadPhoto, deletePhoto } = useImages('books');
  
  const TABLE_NAME = 'books';
  const books = useState('books', () => []);
  const totalBooks = useState('totalBooks', () => 0);
  const perPage = 12;
  const searchTerm = useState('searchTerm', () => {});

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

  const getBookById = async(bookId) => {
    try {
      const { data: book, error: fetchError } = await bookModel
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

      return book;
    } catch(err) {
      console.log('[ERROR] getBookById: ', err);
      return null;
    }
  }

  const getTotalCount = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      totalBooks.value = count;
    } catch(err) {
      console.log('[ERROR] getTotalCount: ', err);
      totalBooks.value = 0;
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
        await getTotalCount();
      }
    } catch(err) {
      console.log('[ERROR] searchBook: ', err);
      books.value = [];
    }
  }

  return {
    books,
    totalBooks,
    perPage,
    getBookById,
    processBook,
    searchBook,
    searchTerm
  }
}