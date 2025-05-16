import type { NotificationOptions } from '~/types/options';
import { ORDER_STATUS } from '~/constants/orders';
import { NOTIFICATION_TYPES, NOTIFICATION_MESSAGES } from '~/constants/notifications';

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
      toStaff = null,
      page = null,
      size = null
    } = options;

    let query = useTable(TABLE_NAME).select(column, { count: 'exact'}).order('created_at', { ascending: false });

    if (id) {
      query = query.eq('id', id);
    }
    if (toStaff) {
      query = query.is('user_id', null);
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

  const getNotificationByOrderStatus = (orderStatus: string) => {
    let type = '';
    let message = '';
    switch (orderStatus) {
      case ORDER_STATUS.BORROWING:
        type = NOTIFICATION_TYPES.ORDER_APPROVED;
        message = NOTIFICATION_MESSAGES.ORDER_APPROVED;
        break;
      case ORDER_STATUS.CLOSE:
        type = NOTIFICATION_TYPES.ORDER_CLOSED;
        message = NOTIFICATION_MESSAGES.ORDER_CLOSED;
        break;
      case ORDER_STATUS.REJECT:
        type = NOTIFICATION_TYPES.ORDER_REJECTED;
        message = NOTIFICATION_MESSAGES.ORDER_REJECTED;
        break;
      case ORDER_STATUS.LOST:
        type = NOTIFICATION_TYPES.ORDER_LOST;
        message = NOTIFICATION_MESSAGES.ORDER_LOST;
        break;
    }
  
    return {
      type,
      message
    };
  }

  return {
    index,
    update,
    insert,
    get,
    getNotificationByOrderStatus
  }
}