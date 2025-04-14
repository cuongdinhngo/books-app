export interface Category {
  id?: Number,
  name?: String
}

export const useCategories = () => {
  const supabase = useSupabaseClient();
  const TABLE_NAME = 'categories';

  const categories = ref([]);
  const totalCategoryCounts = ref<Number|null>(0);
  const perPage = 5;

  const processCategory = async(categoryData: Array<Category>) => {
    try {
      const { data, error} = await useSupabaseClient().from(TABLE_NAME)
        .upsert(categoryData)
        .select();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertCategory: ', err);
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

  const searchCategories = async(categoryIds, page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      if (categoryIds && categoryIds.length > 0) {
        await getCategoriesByIds(categoryIds, from, to);
        totalCategoryCounts.value = categories.value.length;
      } else {
        await getFullCategories(from, to);
        totalCategoryCounts.value = await getTotalCategoryCounts();
      }

      return categories.value;
    } catch(error) {
      console.log('[ERROR] searchCategories: ', error);
      return [];
    }
  }

  const getTotalCategoryCounts = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

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

      categories.value = data;
    } catch(err) {
      console.log('[ERROR] getFullCategories: ', err);
      categories.value = [];
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

      categories.value = data;
    } catch(err) {
      console.log('[ERROR] getCategoriesByIds: ', err);
      categories.value = [];
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