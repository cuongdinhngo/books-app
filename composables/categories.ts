import type { CategoryOptions } from '~/types/options';

const TABLE_NAME = 'categories';

const { insert, get, update, remove } = useCrud(TABLE_NAME);

export const useCategories = () => {

  const index = (options: CategoryOptions = {}) => {

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
      const from = (page -1) * size;
      const to = from + size - 1;
      query = query.range(from, to);
    }

    return query;
  }

  return {
    index,
    insert,
    get,
    update,
    remove
  }
}