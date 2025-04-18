import type { Tables } from '~/types/database.types';

interface GetCategoriesOptions {
  columns?: string,
  ids?: (string | number)[],
  page?: number,
  size?: number
}

const TABLE_NAME = 'categories';
export const useCategories = () => {

  const index = (options: GetCategoriesOptions = {}) => {

    const {
      columns = '*',
      ids = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (ids?.length) {
      query = query.in('id', ids);
    }

    if (page && size && page >= 1 && size >= 1) {
      const from = (page -1) * size;
      const to = from + size - 1;
      query = query.range(from, to);
    }

    return query;
  }

  const insert = (data: Tables<'categories'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const get = (id: number, columns: string = '*') => {
    return useTable(TABLE_NAME).select(columns).eq('id', id).single();
  }

  const update = (id: number, data: Tables<'categories'>) => {
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