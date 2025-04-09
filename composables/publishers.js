export const usePublishers = () => {
  const { apiPath } = useSettings();
  const { token } = useAuth();

  const getPublishersFilter = async() => {
    try {
      return await $fetch(`${apiPath}/publishers/filter`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
    } catch(error) {
      console.log('[ERROR] getPublishersFilter: ', error);
    }
  }

  return {
    getPublishersFilter
  }
}