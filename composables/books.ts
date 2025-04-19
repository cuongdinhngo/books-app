import type { Tables } from '~/types/database.types';
interface GetBooksOptions {
  columns?: string,
  ids?: (string | number)[],
  title?: string,
  authorIds?: (number)[],
  publisherIds?: (number)[],
  categoryIds?: (number)[],
  page?: number,
  size?: number
}

const TABLE_NAME = 'books';
export const useBooks = () => {
  const { uploadPhoto } = useImages('books');
  const { totalBookItems, getTotalBookItemCounts } = useBookItems();

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

  const index = (options: GetBooksOptions = {}) => {
    const {
      columns = [
        'id',
        'title',
        'coverImage:cover_image',
        `publishers (id, name)`,
        `authors (id, name:full_name)`,
        `categories (id, name)`
      ],
      ids = null,
      title = null,
      authorIds = [],
      publisherIds = [],
      categoryIds = [],
      page = null,
      size = null
    } = options;
    let query = useTable(TABLE_NAME).select('*', {count: 'exact'});
    let selectColumns = [];
    selectColumns.push(columns);

    if (title) {
      query = query.ilike('title', `%${title}%`);
    }

    if (ids) {
      query = query.in('id', ids);
    }

    if (authorIds && authorIds.length > 0) {
      selectColumns.push('books_authors!inner(author_id)');
      query = query.in('books_authors.author_id', authorIds);
    }

    if (publisherIds && publisherIds.length > 0) {
      selectColumns.push('books_publishers!inner(publisher_id)');
      query = query.in('books_publishers.publisher_id', publisherIds);
    }

    if (categoryIds && categoryIds.length > 0) {
      selectColumns.push('books_categories!inner(category_id)');
      query = query.in('books_categories.category_id', categoryIds);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query.select(selectColumns.toString());
  }

  const insert = async (data: Tables<'books'>) => {
    const imageUrl = await uploadPhoto(data.cover_image, 'books');
    if (imageUrl) {
      data.cover_image = imageUrl;
    }
    return useTable(TABLE_NAME).insert(data);
  }

  const get = (id: number) => {
    const columns = `
      id,
      title,
      description,
      coverImage:cover_image,
      quantity,
      publishers (id, name),
      authors (id, name:full_name),
      categories (id, name)
    `;
    return useTable(TABLE_NAME).select(columns).eq('id', id).single();
  }

  const update = async (id: number, data: Tables<'books'>) => {
    const imageUrl = await uploadPhoto(data.cover_image, 'books');
    if (imageUrl) {
      data.cover_image = imageUrl;
    }
    return useTable(TABLE_NAME).update(data).eq('id', id);
  }

  const remove = (id: number) => {
    return useTable(TABLE_NAME).delete().eq('id', id);
  }

  return {
    index,
    insert,
    get,
    update,
    remove,
    getBookById,
    getBooksByIds
  }
}