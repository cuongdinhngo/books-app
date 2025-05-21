export const useCrud = (tableName: string) => {
  const insert = (data: any) => {
    return useTable(tableName).insert(data);
  }

  const get = (id: number, columns: string = '*') => {
    return useTable(tableName).select(columns).eq('id', id).single();
  }

  const update = (id: number, data: any) => {
    return useTable(tableName).update(data).eq('id', id);
  }

  const remove = (id: number) => {
    return useTable(tableName).delete().eq('id', id);
  }

  const upsert = (data: any) => {
    return useTable(tableName).upsert(data);
  }

  return {
    insert,
    get,
    update,
    remove,
    upsert
  };
}