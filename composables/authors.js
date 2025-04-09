export const useAuthors = () => {
  const supabase = useSupabaseClient();
  const authorModel = useSupabaseClient().from('authors');
  const bookBucket = useSupabaseClient().storage.from('books');
  const authors = useState('authors', () => []);
  const totalAuthors = useState('totalAuthors', () => null);
  const perPage = 5;

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

  //Handling Page Redirection After Item Deletion
  const getNewPage = (currentPage, totalItem, itemsPerPage) => {
    const isLastItemOnPage = (totalItem % itemsPerPage === 1);
    const isLastPage = currentPage === Math.ceil(totalItem / itemsPerPage);
    
    let redirectPage = currentPage;
    if (isLastItemOnPage && isLastPage && currentPage > 1) {
      redirectPage = currentPage - 1;
    }

    return redirectPage;
  }

  const searchAuthors = async(authorIds, page = 1) => {
    try {
      if (authorIds && authorIds.length > 0) {
        await getAuthorsByIds(authorIds, page);
      } else {
        await getFullAuthors(page);
      }
    } catch(error) {
      console.log('[ERROR] searchAuthors: ', error);
      authors.value = [];
    }
  }

  const getTotalCount = async() => {
    try {
      const { count, error } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error

      totalAuthors.value = count;
    } catch(err) {
      console.log('[ERROR] getTotalCount: ', err);
    }
  }

  const getFullAuthors = async(page = 1) => {
    try {
      let from = (page - 1) * perPage;
      let to = page * perPage - 1;
      console.log(`FROM ${from} TO ${to}`);
      const { data, error } = await supabase.from('authors').select(`
        id,
        fullname:full_name,
        photo,
        birthYear:birth_year,
        deathYear:death_year
      `)
      .limit(perPage)
      .range(from, to);
      if (error) {
        throw error;
      }

      authors.value = data;
      await getTotalCount();
    } catch(err) {
      console.log('[ERROR] getFullAuthors: ', err);
      return [];
    }
  }

  const getAuthorsByIds = async(ids, page = 1) => {
    try {
      let from = 0;
      let to = perPage;
      if (page > 1) {
        from = (page - 1) * perPage;
        to = perPage * page;
      }
      const { data, error } = await supabase.from('authors').select(`
        id,
        fullname:full_name,
        photo,
        birthYear:birth_year,
        deathYear:death_year
      `)
      .filter('id', 'in', `(${ids.join(',')})`)
      .limit(perPage)
      .range(from, to);
      if (error) {
        throw error;
      }

      authors.value = data;
      await getTotalCount();
    } catch(err) {
      console.log('[ERROR] getAuthorsByIds: ', err);
      return [];
    }
  }

  const processAuthor = async(authorData) => {
    try {
      const uploadedPhoto = await uploadPhoto(authorData.photo);
      if (uploadedPhoto) {
        authorData.photo = uploadedPhoto;
      }
      const { data, error} = await authorModel.upsert(authorData).select();
      if (error) {
        throw error;
      }
      return data;
    } catch(err) {
      console.log('[ERROR] upserAuthor: ', err);
    }
  }

  const uploadPhoto = async(photo) => {
    let publicUrl = null;
    if (photo) {
      const photoExt = photo.name.split('.').pop();
      const photoName = `${Math.random()}.${photoExt}`;
      const photoPath = `authors/${photoName}`;

      const { data: uploadedPhoto, error: storageError } = await bookBucket.upload(photoPath, photo);

      if (storageError) {
        console.log('[ERROR] uploading photo: ', storageError);
        throw storageError;
      }
      const { data: dataPublicUrl } = bookBucket.getPublicUrl(photoPath);
      publicUrl = dataPublicUrl.publicUrl;
    }

    return publicUrl;
  }

  const getAuthorsFilter = async() => {
    try {
      const { data, error: queryError } = await authorModel.select(`
        id,
        label:full_name
      `);
      if (queryError) {
        throw queryError;
      }

      return data;
    } catch(error) {
      console.log('[ERROR] getAuthorsFilter: ', error);
      return [];
    }
  }

  const toPage = (page) => {
    return {
      query: {
        page
      },
      hash: '#with-links'
    }
  }

  return {
    authors,
    totalAuthors,
    perPage,
    toPage,
    getAuthorsFilter,
    processAuthor,
    uploadPhoto,
    searchAuthors,
    deleteAuthor,
    getNewPage,
    getTotalCount
  }
}