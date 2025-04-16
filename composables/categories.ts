export interface Category {
  id?: Number,
  name?: String
}

export const useCategories = () => {
  const supabase = useSupabaseClient();
  const TABLE_NAME = 'categories';

  const category = ref<Category>({ id: null, name: null});
  const categories = ref<Array<Category>>([]);
  const totalCategoryCounts = ref<Number|null>(0);
  const perPage = 5;
  const isLoading = ref<Boolean>(false);

  const processCategory = async(categoryData: Category) => {
    try {
      isLoading.value = true;
      const { data, error} = await useSupabaseClient().from(TABLE_NAME)
        .upsert(categoryData)
        .select();
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

  const searchCategories = async(categoryIds = [], page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      
      if (categoryIds && categoryIds.length > 0) {
        return await getCategoriesByIds(categoryIds, from, to);
      } else {
        return await getFullCategories(from, to);
      }
    } catch(error) {
      console.log('[ERROR] searchCategories: ', error);
      return [];
    }
  }

  const getTotalCategoryCounts = async(categoryIds = []) => {
    try {
      let query = supabase.from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      if (categoryIds.length > 0) {
        query = query.filter('id', 'in', `(${categoryIds.join(',')})`);
      }
      const { count, error } = await query;
      if (error) throw error

      return count;
    } catch(err) {
      console.log('[ERROR] getTotalCategoryCounts: ', err);
      return 0;
    }
  }

  const getFullCategories = async(from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          name
        `)
        .limit(perPage)
        .range(from, to);
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] getFullCategories: ', err);
      return [];
    }
  }

  const getCategoriesByIds = async(ids, from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          name
        `)
        .filter('id', 'in', `(${ids.join(',')})`)
        .limit(perPage)
        .range(from, to);
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] getCategoriesByIds: ', err);
      return [];
    }
  }

  const getCategoriesFilter = async() => {
    try {
      const { data, error: queryError } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          label:name
        `)
      ;
      if (queryError) throw queryError;

      return data;
    } catch(error) {
      console.log('[ERROR] getCategoriesFilter: ', error);
      return [];
    }
  }

  return {
    isLoading,
    category,
    categories,
    totalCategoryCounts,
    perPage,
    getCategoriesFilter,
    processCategory,
    searchCategories,
    deleteCategory,
    getTotalCategoryCounts
  }
}