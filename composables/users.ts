import type { Tables } from '~/types/database.types';
import type { UserOptions } from '~/types/options';

const TABLE_NAME = 'users';
const PHOTO_DIRECTORY = 'users';

const { insert, get, remove } = useCrud(TABLE_NAME);

export const useUsers = () => {
  const token = useCookie<String>('token');
  const readerId = useCookie<Number>('readerId');
  const { uploadPhoto } = useImages('books');

  const createReader = async(readerData: Object) => {
    try {
      const { data, error } = await supabase.auth
        .signUp({
          email: readerData.email as string,
          password: readerData.password as string
        });
      if (error) throw error;

      if (data?.user?.id) {
        readerData.id = data.user.id;
        const response = await insert(readerData);
        if (!response) throw new Error('FAILED: Inserting new reader');
      }

      return true;
    } catch(err: any) {
      console.error('[useReaders] createReader: ', err);
      return false;
    }
  }

  const index = (options: UserOptions = {}) => {
    const {
      columns = '*',
      id = null,
      name = null,
      email = null,
      role = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact'}).order('id', { ascending: false });
    if (id) {
      query = query.eq('id', id);
    }
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    if (email) {
      query = query.ilike('email', `%${email}%`);
    }
    if (role) {
      query = query.eq('role', role);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  const update = async(userId: string, data: Tables<'users'>) => {
    const photoUrl = await uploadPhoto(data.photo, PHOTO_DIRECTORY);
    if (photoUrl) {
      data.photo = photoUrl;
    }
    return useTable(TABLE_NAME).update(data).eq('id', userId);
  }

  return {
    index,
    get,
    update,
    token,
    readerId,
    insert
  }
}