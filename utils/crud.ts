export const useCrud = (tableName: string) => {
  const insert = (data: any) => {
    return useTable(tableName).insert(data);
  }

  const get = (id: number, columns: string = '*') => {
    console.log('get', tableName, id, columns);
    return useTable(tableName).select(columns).eq('id', id).single();
  }

  const update = (id: number, data: any) => {
    return useTable(tableName).update(data).eq('id', id);
  }

  const remove = (id: number) => {
    return useTable(tableName).delete().eq('id', id);
  }

  return {
    insert,
    get,
    update,
    remove
  };
}