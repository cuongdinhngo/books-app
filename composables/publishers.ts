import type { Tables } from '~/types/database.types';

interface GetPublishersOptions {
  selectColumns?: string,
  filterIds?: (number | string)[],
  page?: number,
  pageSize?: number
};

export const usePublishers = () => {
  const supabase = useSupabaseClient();
  const { uploadPhoto, deletePhoto } = useImages('books');
  const TABLE_NAME = 'publishers';

  const publishers = ref<Tables<'publishers'>[]>([]);
  const publisher = ref<Tables<'publishers'>>();
  const totalPublisherCounts = ref<number>(0);
  const perPage = 5;
  const isLoading = ref<boolean>(false);

  const getPublishers = async(options: GetPublishersOptions = {}) => {
    const {
      selectColumns,
      filterIds,
      page,
      pageSize
    } = options;

    try {
      let query = supabase.from(TABLE_NAME)
        .select(selectColumns)
      ;
      if (filterIds && filterIds.length > 0) {
        query = query.in('id', filterIds);
      }

      if (page && page > 0 && pageSize && pageSize > 0) {
        const from = (page - 1) * pageSize;
        const to = page * pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch(err) {
      console.error(`[ERROR] getPublishers with ${JSON.stringify(options)}: `, err);
      return [];
    }
  }

  const processPublisher = async(publisherData: Tables<'publishers'>) => {
    try {
      isLoading.value = true;
      const uploadedLogo = await uploadPhoto(publisherData.logo, TABLE_NAME);
      if (uploadedLogo) {
        publisherData.logo = uploadedLogo;
      }

      const { data, error} = await supabase.from(TABLE_NAME).upsert(publisherData).select();
      if (error) throw error;

      isLoading.value = false;
      return data;
    } catch(err) {
      isLoading.value = false;
      console.log('[ERROR] upsertPublisher: ', err);
      return null;
    }
  }

  const deletePublisher = async(publisherId: number) => {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', publisherId);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] deletePublisher: ', err);
      return false;
    }
  }

  const getTotalPublisherCounts = async(options: GetPublishersOptions = {}) => {
    try {
      const { filterIds } = options;
      let query = supabase.from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
      ;
      if (filterIds && filterIds.length > 0) {
        query = query.in('id', filterIds);
      }

      const { count, error } = await query;
      if (error) throw error

      return count;
    } catch(err) {
      console.log(`[ERROR] getTotalPublisherCounts with ${JSON.stringify(options)} `, err);
      return 0;
    }
  }

  const getPublishersFilter = async() => {
    try {
      const { data, error: queryError } = await supabase.from(TABLE_NAME).select(`
        id,
        label:name
      `);
      if (queryError) throw queryError;

      return data;
    } catch(error) {
      console.log('[ERROR] getAuthorsFilter: ', error);
      return [];
    }
  }

  return {
    isLoading,
    publisher,
    publishers,
    totalPublisherCounts,
    perPage,
    getPublishersFilter,
    processPublisher,
    deletePublisher,
    getTotalPublisherCounts,
    getPublishers
  }
}