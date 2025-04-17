export interface CategoriesOptions {
  columns?: string,
  ids?: (string | number)[],
  page?: number,
  size?: number
}


export const useTable = (table: any) => useSupabaseClient().from(table)
export const useToastError = (e: any) => {
    console.error(e)
    useToast().add({
      description: 'This action failed. Please try again.',
      color: 'error'
    })
}

const TABLE = 'categories'
export const useTest = () => {

  const index = async (options: CategoriesOptions = {}) => {
    const { columns = '*', ids, page = 1, size = 10 } = options
    const query = useTable(TABLE).select(columns)

    if (ids?.length) {
      query.in('id', ids)
    }
    const from = (page - 1) * size
    query.range(from, from + size - 1)
    return await query
  }

  const get = async (id: number | string, columns: string = '*') => {
    return await useTable(TABLE).select(columns).eq('id', id).single()
  }
  const update = (id: number, record: any) => {
    return useTable(TABLE).update(record).eq('id', id)
  }
  const remove = async (id: number | string) => {
    return await useTable(TABLE).delete().eq('id', id)
  }

  return {
    index,
    get,
    update,
    remove
  }
}
