export const useCategories = () => {
  const { apiPath } = useSettings();
  const { token } = useAuth();

  const getCategoriesFilter = async() => {
    try {
      return await $fetch(`${apiPath}/categories/filter`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
    } catch(error) {
      console.log('[ERROR] getCategoriesFilter: ', error);
    }
  }

  return {
    getCategoriesFilter
  }
}