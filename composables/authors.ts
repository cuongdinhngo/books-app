interface Author {
  id?: Number,
  fullName?: String,
  photo?: String,
  birthYear?: String,
  deathYear?: String
}

export const useAuthors = () => {
  const supabase = useSupabaseClient();
  const { uploadPhoto } = useImages('books');
  const TABLE_NAME = 'authors';

  const author = ref<Author>({});
  const authors = ref<Array<Author>>([]);
  const totalAuthorCounts = ref<Number>(0);
  const perPage = 5;

  const processAuthor = async(authorData: Author) => {
    try {
      const uploadedPhoto = await uploadPhoto(authorData.logo, TABLE_NAME);
      if (uploadedPhoto) {
        authorData.photo = uploadedPhoto;
      }

      const { data, error} = await supabase.from(TABLE_NAME)
        .upsert({
          id: authorData.id,
          full_name: authorData.fullName,
          photo: authorData.photo,
          birth_year: authorData.birthYear,
          death_year: authorData.deathYear
        })
        .select();
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] upsertAuthor: ', err);
      return null;
    }
  }

  const deleteAuthor = async(authorId) => {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', authorId);
      if (error) throw error;

      return true;
    } catch(err) {
      console.log('[ERROR] deleteAuthor: ', err);
      return false;
    }
  }

  const searchAuthors = async(authorIds = [], page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      if (authorIds && authorIds.length > 0) {
        return await getAuthorsByIds(authorIds, from, to);
      } else {
        return getFullAuthors(from, to);
      }
    } catch(error) {
      console.log('[ERROR] searchAuthors: ', error);
      return [];
    }
  }

  const getTotalAuthorCounts = async(authorIds = []) => {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });
      if (authorIds.length > 0) {
        query = query.filter('id', 'in', `(${authorIds.join(',')})`);
      }

      const { count, error } = await query;
      if (error) throw error

      return count;
    } catch(err) {
      console.log('[ERROR] getTotalAuthorCounts: ', err);
      return 0;
    }
  }

  const getFullAuthors = async(from, to) => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME)
        .select(`
          id,
          fullname:full_name,
          photo,
          birthYear:birth_year,
          deathYear:death_year
        `)
        .limit(perPage)
        .range(from, to);
      if (error) throw error;

      return data;
    } catch(err) {
      console.log('[ERROR] getFullAuthors: ', err);
      return [];
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

      return data;
    } catch(err) {
      console.log('[ERROR] getAuthorsByIds: ', err);
      return [];
    }
  }

  const getAuthorsFilter = async() => {
    try {
      const { data, error: queryError } = await supabase.from(TABLE_NAME).select(`
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
    author,
    authors,
    totalAuthorCounts,
    perPage,
    getAuthorsFilter,
    processAuthor,
    searchAuthors,
    deleteAuthor,
    getTotalAuthorCounts
  }
}