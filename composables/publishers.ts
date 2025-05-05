import type { Tables } from '~/types/database.types';
import type { PublisherOptions } from '~/types/options';

const TABLE_NAME = 'publishers';

const { insert: createNewPublisher, get, update: updatePublisher, remove } = useCrud(TABLE_NAME);

export const usePublishers = () => {
  const { uploadPhoto } = useImages('books');

  const index = (options: PublisherOptions = {}) => {

    const {
      columns = '*',
      ids = null,
      name = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact' });

    if (ids?.length) {
      query = query.in('id', ids);
    }

    if (name && name.length >= 2) {
      query = query.ilike('name', `%${name}%`);
    }

    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1 ) * size, page * size - 1);
    }

    return query;
  }

  const insert = async (data: Tables<'publishers'>) => {
    const logoUrl = await uploadPhoto(data.logo, 'publishers');
    if (logoUrl) {
      data.logo = logoUrl;
    }
    return createNewPublisher(data);
  }

  const update = async (id: number, data: Tables<'publishers'>) => {
    const logoUrl = await uploadPhoto(data.logo, 'publishers');
    if (logoUrl) {
      data.logo = logoUrl;
    }
    return updatePublisher(id, data);
  }

  return {
    index,
    insert,
    get,
    update,
    remove
  }
}