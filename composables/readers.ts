import type { Tables } from '~/types/database.types';

interface GetReadersOptions {
  columns?: string,
  id?: string,
  fullName?: string,
  email?: string,
  page?: number,
  size?: number
}

const TABLE_NAME = 'readers';
export const useReaders = () => {
  const token = useCookie<String>('token');
  const readerId = useCookie<Number>('readerId');

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

  const insert = (data: Tables<'readers'>) => {
    return useTable(TABLE_NAME).insert(data);
  }

  const index = (options: GetReadersOptions = {}) => {
    const {
      columns = '*',
      fullName = null,
      email = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(columns, { count: 'exact'});
    if (fullName) {
      query = query.ilike('full_name', `%${fullName}%`);
    }
    if (email) {
      query = query.ilike('email', `%${email}%`);
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1);
    }

    return query;
  }

  return {
    index,
    token,
    readerId
  }
}