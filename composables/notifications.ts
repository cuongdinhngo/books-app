import type { NotificationOptions } from '~/types/options';

const TABLE_NAME = 'notifications';

const { insert, update} = useCrud(TABLE_NAME);

export const useNotifications = () => {
  
  const index = (options: NotificationOptions = {}) => {
    const {
      column = '*',
      id = null,
      readerId = null,
      type = null,
      isRead = null,
      notifiableId = null,
      notifiableType = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(column, { count: 'exact'});

    if (id) {
      query = query.eq('id', id);
    }
    if (readerId) {
      query = query.eq('user_id', readerId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (isRead) {
      query = query.eq('is_read', isRead);
    }
    if (notifiableId && notifiableType) {
      query = query.match({ notifiable_id: notifiableId, notifiable_type: notifiableType });
    }
    if (page && size && page >= 1 && size >= 1) {
      query = query.range((page - 1) * size, page * size - 1)
    }

    return query;
  }

  const get = (userId: string, columns: string = '*') => {
    return useTable(TABLE_NAME)
      .select(columns)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); 
  }

  return {
    index,
    update,
    insert,
    get
  }
}