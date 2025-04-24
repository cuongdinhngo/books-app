import type { Tables } from '~/types/database.types';

interface GetPublishersOptions {
  columns?: string,
  ids?: (string | number)[],
  name?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'publishers';
export const usePublishers = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: GetPublishersOptions = {}) => {

    const {
      columns = '*',
      ids = null,
      name = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (ids?.length) {
      query = query.in('id', ids);
    }

    if (name && name.length >= 2) {
      query = query.ilike('name', `%${name}%`);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1 ) * size, page * size - 1);
    }

    return query;
  }

  const insert = async (data: Tables<'publishers'>) => {
    const logoUrl = await uploadPhoto(data.logo, 'publishers');
    if (logoUrl) {
      data.logo = logoUrl;
    }
    return useTable(TABLE_NAME).insert(data);
  }

  const get = (id: number, columns: string = '*') => {
    return useTable(TABLE_NAME).select(columns).eq('id', id).single();
  }

  const update = async (id: number, data: Tables<'publishers'>) => {
    const logoUrl = await uploadPhoto(data.logo, 'publishers');
    if (logoUrl) {
      data.logo = logoUrl;
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