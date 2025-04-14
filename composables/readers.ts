interface Reader {
  id?: String;
  fullName?: String;
  birthday?: Date;
  address?: String;
  email?: String;
  password?: String
}

interface UseReadersOptions {
  initialLimit?: Number;
}

export const useReaders = (options: UseReadersOptions = {}) => {
  const { initialLimit = 10 } = options;
  const supabase = useSupabaseClient();
  const TABLE_NAME = 'readers';
  const token = useCookie<String>('token');
  const readerId = useCookie<Number>('readerId');

  const readers = useState<Array<any>>('readers', () => []);
  const reader = useState<Object | null>('reader', () => null);
  const isLoading = useState<Boolean>('isLoading', () => false);
  const error = useState<String | null>('error', () => null);
  const totalReaderCounts = useState<Number | null>('totalReaderCounts', () => 0);

  async function searchReaders(searchTerm: Object) {
    try {
      isLoading.value = true;
      let query = supabase.from(TABLE_NAME)
        .select(`
          id,
          fullName:full_name,
          email
        `)
      ;
      if (searchTerm?.name) {
        query = query.ilike('full_name', `%${searchTerm.name}%`);
      }
      if (searchTerm?.email) {
        query = query.ilike('email', `%${searchTerm.email}%`);
      }
      const { data, error } = await query;
      if (error) throw error;

      isLoading.value = false;
      readers.value = data;
      if (searchTerm?.email || searchTerm?.name) {
        totalReaderCounts.value = data.length;
      } else {
        await getTotalReaderCounts();
      }
    } catch(err) {
      console.error('[ERROR] searchReaders: ', err);
      readers.value = [];
    }
  }

  async function getTotalReaderCounts() {
    try {
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })

      if (error) throw error

      totalReaderCounts.value = count;
      return count;
    } catch(err) {
      console.log('[ERROR] getTotalReaderCounts: ', err);
      totalReaderCounts.value = 0;
      return 0;
    }
  }

  async function createReader(readerData: Reader): Promise<boolean> {
    try {
      isLoading.value = true;
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

      isLoading.value = false;
      return true;
    } catch(err: any) {
      console.error('[useReaders] createReader: ', err);
      isLoading.value = false;
      error.value = 'Something was wrong. Please try again later!';
      return false;
    }
  }

  async function insert(readerData: Object): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert({
          id: readerData.id,
          full_name: readerData.fullName,
          birthday: readerData.birthday,
          address: readerData.address,
          email: readerData.email
        })
      ;
      if (error) throw error; 

      return true;
    } catch(err) {
      console.error('[useReaders] insert: ', err);
      return false;
    }
  }

  return {
    reader: readonly(reader),
    isLoading: readonly(isLoading),
    error: readonly(error),
    totalReaderCounts: readonly(totalReaderCounts),
    readers: readonly(readers),

    createReader,
    token,
    readerId,
    getTotalReaderCounts,
    searchReaders
  }
}