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
export const BOOK_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost'
};

export const useBooks = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: GetBooksOptions = {}) => {
    console.log('BOOK INDEX => ', options);

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
    console.log('GET BOOK => ', id);
    const columns = `
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
    remove
  }
}