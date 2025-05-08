import type { Tables } from '~/types/database.types';

interface GetStaffOptions {
  columns?: string,
  ids?: (string|number)[],
  email?: string,
  fullName?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'users';
const PHOTO_DIRECTORY = 'users';
export const useStaff = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: GetStaffOptions = {}) => {
    const {
      columns = '*',
      ids = null,
      email = null,
      fullName = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count:'exact' });

    if (ids && ids.length > 0) {
      query = query.in('id', ids);
    }

    if (email) {
      query = query.ilike('email', `%${email}%`);
    }

    if (fullName) {
      query = query.ilike('full_name', `%${fullName}%`)
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const get = (staffId: number, columns: string = '*') => {
    return useTable(TABLE_NAME).select(columns).eq('id', staffId).single();
  }

  const update = async(staffId: number, data: Tables<'users'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return useTable(TABLE_NAME).update(data).eq('id', staffId);
  }

  const insert = async(data: Tables<'users'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return useTable(TABLE_NAME).insert(data);
  }

  return {
    index,
    get,
    update,
    insert
  }
}