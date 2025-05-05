import type { Tables } from '~/types/database.types';
import type { AuthorOptions } from '~/types/options';

const TABLE_NAME = 'authors';
const PHOTO_DIRECTORY = 'authors';

const {
  insert:createNewAuthor,
  get,
  update:updateAuthor,
  remove
} = useCrud(TABLE_NAME);

export const useAuthors = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: AuthorOptions = {}) => {

    const {
      columns = '*',
      full_name = null,
      ids = null,
      page = null,
      size = null,
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (full_name && full_name.length >= 2) {
      query = query.ilike('full_name', `%${full_name}%`)
    }
    if (ids?.length) {
      query = query.in('id', ids);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1 ) * size, page * size - 1);
    }

    return query;
  }

  const insert = async (data: Tables<'authors'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return createNewAuthor(data);
  }

  const update = async (id: number, data: Tables<'authors'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return updateAuthor(id, data);
  }

  return {
    index,
    insert,
    get,
    update,
    remove
  }
}