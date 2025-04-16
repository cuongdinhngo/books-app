export interface Publisher {
  id?: Number,
  name?: String,
  logo?: String
}

export const usePublishers = () => {
  const supabase = useSupabaseClient();
  const { uploadPhoto, deletePhoto } = useImages('books');
  const TABLE_NAME = 'publishers';

  const publishers = ref<Array<Publisher>>([]);
  const publisher = ref<Publisher>({})
  const totalPublisherCounts = ref<Number|null>(0);
  const perPage = 5;
  const isLoading = ref<Boolean>(false);

  const processPublisher = async(publisherData: Publisher) => {
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

  const deletePublisher = async(publisherId: Number) => {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', publisherId);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] deletePublisher: ', err);
      return false;
    }
  }

  const searchPublishers = async(publisherIds: Array<Number> = [], page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      if (publisherIds && publisherIds.length > 0) {
        return await getPublishersByIds(publisherIds, from, to);
      } else {
        return await getFullPublishers(from, to);
      }
    } catch(error) {
      console.log('[ERROR] searchAuthors: ', error);
      return [];
    }
  }

  const getTotalPublisherCounts = async(publisherIds = []) => {
    try {
      let query = supabase.from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
      ;
      if (publisherIds.length > 0) {
        query = query.filter('id', 'in', `(${publisherIds.join(',')})`)
      }

      const { count, error } = await query;
      if (error) throw error

      return count;
    } catch(err) {
      console.log('[ERROR] getTotalPublisherCounts: ', err);
      return 0;
    }
  }

  const getFullPublishers = async(from: Number, to: Number) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`
        id,
        name,
        logo
      `)
      .limit(perPage)
      .range(from, to);
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] getFullPublishers: ', err);
      return [];
    }
  }

  const getPublishersByIds = async(ids: Array<Number>, from: Number, to: Number) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`
        id,
        name,
        logo
      `)
      .filter('id', 'in', `(${ids.join(',')})`)
      .limit(perPage)
      .range(from, to);
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] getAuthorsByIds: ', err);
      return [];
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
    searchPublishers,
    deletePublisher,
    getTotalPublisherCounts
  }
}