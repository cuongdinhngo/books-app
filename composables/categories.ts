import type { Database, Tables, Enums } from '~/types/database.types';

interface GetCategoriesOptions {
  selectColumns?: string,
  filterIds?: (string | number)[],
  page?: number,
  pageSize?: number,
  isCountable?: boolean
}

export const useCategories = () => {
  const supabase = useSupabaseClient();
  const TABLE_NAME = 'categories';

  const category = ref<Tables<'categories'>>();
  const categories = ref<Tables<'categories'>[]>([]);
  const totalCategoryCounts = ref<number|null>(0);
  const isLoading = ref<boolean>(false);

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
    isLoading,
    category,
    categories,
    totalCategoryCounts,
    processCategory,
    getCategories,
    deleteCategory,
    getTotalCategoryCounts
  }
}