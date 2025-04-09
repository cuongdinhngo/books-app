export const useAuthors = () => {
  const supabase = useSupabaseClient();
  const authorModel = useSupabaseClient().from('authors');
  const { uploadPhoto } = useImages('books');
  const TABLE_NAME = 'authors';

  const authors = useState('authors', () => []);
  const totalAuthors = useState('totalAuthors', () => 0);
  const perPage = 5;

  const processAuthor = async(authorData) => {
    try {
      const uploadedPhoto = await uploadPhoto(authorData.logo, TABLE_NAME);
      if (uploadedPhoto) {
        authorData.photo = uploadedPhoto;
      }

      const { data, error} = await authorModel.upsert(authorData).select();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertAuthor: ', err);
      return null;
    }
  }

  const deleteAuthor = async(authorId) => {
    try {
      const { status, error: deletedError } = await authorModel.delete().eq('id', authorId);
      if (deletedError) throw deletedError;

      if (204 === status) {
        await getTotalCount();
        if (authors.value.length > 0) {
          authors.value = removeObjectById(authors.value, authorId);
        }
      } else {
        console.log('[ERROR] deleteAuthor: status is NOT 204');
      }
    } catch(error) {
      console.log('[ERROR] deleteAuthor: ', error);
    }
  }

  const searchAuthors = async(authorIds, page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      console.log(`FROM ${from} TO ${to}`);
      if (authorIds && authorIds.length > 0) {
        await getAuthorsByIds(authorIds, from, to);
        totalAuthors.value = authorIds.value.length;
      } else {
        await getFullAuthors(from, to);
        await getTotalCount();
      }

      return authors.value;
    } catch(error) {
      console.log('[ERROR] searchAuthors: ', error);
      return [];
    }
  }

  const getTotalCount = async() => {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error

      totalAuthors.value = count;
    } catch(err) {
      console.log('[ERROR] getTotalCount: ', err);
      totalAuthors.value = 0;
    }
  }

  const getFullAuthors = async(from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`
        id,
        fullname:full_name,
        photo,
        birthYear:birth_year,
        deathYear:death_year
      `)
      .limit(perPage)
      .range(from, to);
      if (error) throw error;

      authors.value = data;
    } catch(err) {
      console.log('[ERROR] getFullAuthors: ', err);
      authors.value = [];
    }
  }

  const getAuthorsByIds = async(ids, from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select(`
        id,
        fullname:full_name,
        photo,
        birthYear:birth_year,
        deathYear:death_year
      `)
      .filter('id', 'in', `(${ids.join(',')})`)
      .limit(perPage)
      .range(from, to);
      if (error) throw error;

      authors.value = data;
    } catch(err) {
      console.log('[ERROR] getAuthorsByIds: ', err);
      authors.value = [];
    }
  }

  const getAuthorsFilter = async() => {
    try {
      const { data, error: queryError } = await authorModel.select(`
        id,
        label:full_name
      `);
      if (queryError) throw queryError;

      return data;
    } catch(error) {
      console.log('[ERROR] getAuthorsFilter: ', error);
      return [];
    }
  }

  return {
    authors,
    totalAuthors,
    perPage,
    getAuthorsFilter,
    processAuthor,
    searchAuthors,
    deleteAuthor
  }
}