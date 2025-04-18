import type { Database, Tables, Enums } from '~/types/database.types';

interface GetCategoriesOptions {
  columns?: string,
  ids?: (string | number)[],
  page?: number,
  size?: number,
  isCountable?: boolean
}

const TABLE_NAME = 'categories';
export const useCategories = () => {

  const index = (options: GetCategoriesOptions = {}) => {
    const {
      columns = '*',
      ids = null,
      page = null,
      size = null,
      isCountable = false
    } = options;

    let query = useTable(TABLE_NAME);
    if (isCountable) {
      query = query.select('*', {count: 'exact', head: true});
    } else {
      query = query.select(columns);
    }

    if (ids?.length) {
      query = query.in('in', ids);
    }
    if (page && size && page > 1 && size > 1) {
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

  const counts = () => {
    return useTable(TABLE_NAME).select('*', {count: 'exact', head: true});
  }

  const processCategory = async(categoryData: Tables<'categories'>) => {
    try {
      isLoading.value = true;
      const { data, error} = await useSupabaseClient().from(TABLE_NAME)
        .upsert(categoryData)
        .select()
      ;
      if (error) throw error;

      isLoading.value = false;
      return data;
    } catch(err) {
      console.log('[ERROR] upsertCategory: ', err);
      isLoading.value = false;
      return null;
    }
  }

  const deleteCategory = async(categoryId: Number) => {
    try {
      const { error } = await useSupabaseClient().from(TABLE_NAME)
        .delete()
        .eq('id', categoryId);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] deleteCategory: ', err);
      return false;
    }
  }

  const getCategories = async(options: GetCategoriesOptions = {}) => {
    const {
      selectColumns,
      filterIds,
      page,
      pageSize
    } = options;

    try {
      let query = supabase.from(TABLE_NAME).select(selectColumns);

      if (filterIds && filterIds.length > 0) {
        query = query.in('id', filterIds);
      }

      if (page !== null && pageSize !== null && page > 0 && pageSize > 0) {
        const from = (page - 1) * pageSize;
        const to = page * pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch(err) {
      console.error(`[ERROR] getCategories with ${JSON.stringify(options)} : `, err);
      return [];
    }
  }

  const getTotalCategoryCounts = async(options: GetCategoriesOptions = {}) => {
    try {
      const { filterIds } = options;
      let query = supabase.from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
      ;
      if (filterIds && filterIds.length > 0) {
        query = query.in('id', filterIds);
      }

      const { count, error } = await query;
      if (error) throw error; 

      return count;
    } catch(err) {
      console.log(`[ERROR] getTotalCategoryCounts with ${JSON.stringify(options)}`, err);
      return 0;
    }
  }

  return {
    index,
    insert,
    get,
    update,
    remove,
    counts,
    processCategory,
    getCategories,
    deleteCategory,
    getTotalCategoryCounts,
  }
}