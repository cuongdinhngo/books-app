import type { Tables } from '~/types/database.types';

interface GetAuthorsOptions {
  columns?: string,
  ids?: (string | number)[],
  full_name?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'authors';
const PHOTO_DIRECTORY = 'authors';
export const useAuthors = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: GetAuthorsOptions = {}) => {

    const {
      columns = '*',
      full_name = null,
      ids = null,
      page = null,
      size = null,
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (full_name && full_name.length >= 2) {
      query = query.ilike('full_name', `%${full_name}%`)
    }
    if (ids?.length) {
      query = query.in('id', ids);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1 ) * size, page * size - 1);
    }

    return query;
  }

  const insert = async (data: Tables<'authors'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return useTable(TABLE_NAME).insert(data);
  }

  const get = (id: number, columns: string = '*') => {
    return useTable(TABLE_NAME).select(columns).eq('id', id).single();
  }

  const update = async (id: number, data: Tables<'authors'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
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