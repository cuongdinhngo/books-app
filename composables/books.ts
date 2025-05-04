import type { Tables } from '~/types/database.types';
interface GetBooksOptions {
  columns?: string,
  ids?: (string | number)[],
  title?: string,
  authorIds?: (number)[],
  publisherIds?: (number)[],
  categoryIds?: (number)[],
  status?: (string)[],
  page?: number,
  size?: number
}

const TABLE_NAME = 'books';
export const BOOK_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost'
};

export const useBooks = () => {
  const supabase = useSupabaseClient();
  const { uploadPhoto } = useImages('books');

  const index = (options: GetBooksOptions = {}) => {
    console.log('BOOK OPTIONS => ', options);

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
      status = null,
      page = null,
      size = null
    } = options;
    let query = useTable(TABLE_NAME).select('*', {count: 'exact'}).order('created_at', { ascending: false });;
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
      selectColumns.push('book_items!inner(status)');
      query = query.in('book_items.status', status);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    console.log('SELECTED COLUMNS => ', selectColumns.toString());

    return query.select(selectColumns.toString());
  }

  const insert = async (data: Tables<'books'>) => {
    const imageUrl = await uploadPhoto(data.cover_image, 'books');
    if (imageUrl) {
      data.cover_image = imageUrl;
    }
    return useTable(TABLE_NAME).insert(data);
  }

  const get = (id: number, columns: string = '') => {
    let selectColumns = `
      id,
      title,
      description,
      coverImage:cover_image,
      quantity,
      publishers(id, name),
      authors(id, name:full_name),
      categories(id, name),
      book_items(id, book_id, status)
    `;
    if (columns.length > 0) {
      selectColumns = `${selectColumns}, ${columns}`;
    }
    return useTable(TABLE_NAME).select(selectColumns).eq('id', id).single();
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

  const getTopRatings = () => {
    return supabase.rpc('get_average_ratings_with_book_details');
  }

  return {
    index,
    insert,
    get,
    update,
    remove,
    getTopRatings
  }
}