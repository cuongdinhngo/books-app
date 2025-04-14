export const usePublishers = () => {
  const supabase = useSupabaseClient();
  const publisherModel = useSupabaseClient().from('publishers');
  const { uploadPhoto, deletePhoto } = useImages('books');
  const TABLE_NAME = 'publishers';

  const publishers = useState('publishers', () => []);
  const totalPublisherCounts = ref(0);
  const perPage = 5;

  const processPublisher = async(publisherData) => {
    try {
      const uploadedLogo = await uploadPhoto(publisherData.logo, TABLE_NAME);
      if (uploadedLogo) {
        publisherData.logo = uploadedLogo;
      }

      const { data, error} = await publisherModel.upsert(publisherData).select();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertPublisher: ', err);
      return null;
    }
  }

  const deletePublisher = async(publisherId) => {
    try {
      const { status, error: deletedError } = await publisherModel.delete().eq('id', publisherId);
      if (deletedError) throw deletedError;

      if (204 === status) {
        totalPublisherCounts.value = await getTotalPublisherCounts();
        if (publishers.value.length > 0) {
          publishers.value = removeObjectById(publishers.value, publisherId);
        }
      } else {
        console.log('[ERROR] deletePublisher: status is NOT 204');
      }
    } catch(error) {
      console.log('[ERROR] deletePublisher: ', error);
    }
  }

  const searchPublishers = async(publisherIds, page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      if (publisherIds && publisherIds.length > 0) {
        await getPublishersByIds(publisherIds, from, to);
        totalPublisherCounts.value = publishers.value.length;
      } else {
        await getFullPublishers(from, to);
        totalPublisherCounts.value = await getTotalPublisherCounts();
      }

      return publishers.value;
    } catch(error) {
      console.log('[ERROR] searchAuthors: ', error);
      return [];
    }
  }

  const getTotalPublisherCounts = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      return count;
    } catch(err) {
      console.log('[ERROR] getTotalPublisherCounts: ', err);
      return 0;
    }
  }

  const getFullPublishers = async(from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`
        id,
        name,
        logo
      `)
      .limit(perPage)
      .range(from, to);
      if (error) throw error;

      publishers.value = data;
    } catch(err) {
      console.log('[ERROR] getFullPublishers: ', err);
      publishers.value = [];
    }
  }

  const getPublishersByIds = async(ids, from, to) => {
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

      publishers.value = data;
    } catch(err) {
      console.log('[ERROR] getAuthorsByIds: ', err);
      publishers.value = [];
    }
  }

  const getPublishersFilter = async() => {
    try {
      const { data, error: queryError } = await publisherModel.select(`
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