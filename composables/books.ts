import type { Tables } from '~/types/database.types';
import type { BookOptions } from '~/types/options';

const TABLE_NAME = 'books';
export const BOOK_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost'
};

const { insert: createNewBook, get: getBook, update: updateBook, remove } = useCrud(TABLE_NAME);

export const useBooks = () => {
  const supabase = useSupabaseClient();
  const { uploadPhoto } = useImages('books');

  const index = (options: BookOptions = {}) => {
    const {
      columns = [
        'id',
        'title',
        'coverImage:cover_image',
        `publishers (id, name)`,
        `authors (id, name:full_name)`,
        `categories (id, name)`,
      ],
      ids = null,
      title = null,
      authorIds = [],
      publisherIds = [],
      categoryIds = [],
      status = null,
      isHead = false,
      page = null,
      size = null
    } = options;
    let query = useTable(TABLE_NAME).select('*', { count: 'exact', head: isHead }).order('id', { ascending: false });;
    let selectColumns = [];
    selectColumns.push(columns);

    if (title && title.length >= 2) {
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

    if (status && status.length > 0) {
      selectColumns.push('book_copies!inner(status)');
      query = query.in('book_copies.status', status);
    } else {
      selectColumns.push('book_copies (id, status)');
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
    const previewUrl = await uploadPhoto(data.preview_file, 'book-preview');
    if (previewUrl) {
      data.preview_file = previewUrl;
    }
    return createNewBook(data);
  }

  const get = (id: number, columns: string = '') => {
    let selectColumns = `
      id,
      title,
      description,
      coverImage:cover_image,
      previewFile:preview_file,
      publishers(id, name),
      authors(id, name:full_name),
      categories(id, name),
      book_copies(id, book_id, status),
      book_photos(id, image_url)
    `;
    if (columns.length > 0) {
      selectColumns = `${selectColumns}, ${columns}`;
    }

    return getBook(id, selectColumns);
  }

  const update = async (id: number, data: Tables<'books'>) => {
    if (data.cover_image && typeof data.cover_image !== 'string') {
      const imageUrl = await uploadPhoto(data.cover_image, 'books');
      if (imageUrl) {
        data.cover_image = imageUrl;
      }
    }

    const previewUrl = await uploadPhoto(data.preview_file, 'book-preview');
    if (previewUrl) {
      data.preview_file = previewUrl;
    }
    return updateBook(id, data);
  }

  const getTopRatings = (limit: number = 10) => {
    return supabase.rpc('get_average_ratings_with_book_details', { limit_count: limit });
  }

  const getTopBorrowedBooksByHistoricalVisits = (key: string = 'categories', limit: number = 10, offset: number = 0) => {
    const categories = useHistories().get(key);
    if (categories.length === 0) {
      return [];
    } else {
      return supabase.rpc(
        'get_top_borrowed_books_by_categories',
        { p_category_ids: categories.map((category) => Number(category)), p_limit: limit, p_offset: offset }
      );
    }
  }

  return {
    index,
    insert,
    get,
    update,
    remove,
    getTopRatings,
    getTopBorrowedBooksByHistoricalVisits
  }
}