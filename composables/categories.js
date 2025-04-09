export const useCategories = () => {
  const supabase = useSupabaseClient();
  const categoryModel = useSupabaseClient().from('categories');
  const TABLE_NAME = 'categories';

  const categories = useState('categories', () => []);
  const totalCategories = useState('totalCategories', () => 0);
  const perPage = 5;

  const processCategory = async(categoryData) => {
    try {
      const { data, error} = await categoryModel.upsert(categoryData).select();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertCategory: ', err);
      return null;
    }
  }

  const deleteCategory = async(categoryId) => {
    try {
      const { status, error: deletedError } = await categoryModel.delete().eq('id', categoryId);
      if (deletedError) throw deletedError;

      if (204 === status) {
        await getTotalCount();
        if (categories.value.length > 0) {
          categories.value = removeObjectById(categories.value, categoryId);
        }
      } else {
        console.log('[ERROR] deleteCategory: status is NOT 204');
      }
    } catch(error) {
      console.log('[ERROR] deleteCategory: ', error);
    }
  }

  const searchCategories = async(categoryIds, page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      console.log(`FROM ${from} TO ${to}`);
      if (categoryIds && categoryIds.length > 0) {
        await getCategoriesByIds(categoryIds, from, to);
        totalCategories.value = categories.value.length;
      } else {
        await getFullCategories(from, to);
        await getTotalCount();
      }

      return categories.value;
    } catch(error) {
      console.log('[ERROR] searchCategories: ', error);
      return [];
    }
  }

  const getTotalCount = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      totalCategories.value = count;
    } catch(err) {
      console.log('[ERROR] getTotalCount: ', err);
      totalCategories.value = 0;
    }
  }

  const getFullCategories = async(from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`id, name`)
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
      const { data, error } = await supabase.from(TABLE_NAME).select(`id, name`)
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
      const { data, error: queryError } = await categoryModel.select(`
        id,
        label:name
      `);
      if (queryError) throw queryError;

      return data;
    } catch(error) {
      console.log('[ERROR] getCategoriesFilter: ', error);
      return [];
    }
  }

  return {
    categories,
    totalCategories,
    perPage,
    getCategoriesFilter,
    processCategory,
    searchCategories,
    deleteCategory,
    getTotalCount
  }
}