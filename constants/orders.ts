export const ORDER_STATUS = {
  WAITING: 'waiting',
  BORROWING: 'borrowing',
  CLOSE: 'closed',
  REJECT: 'rejected',
  LOST: 'lost',
  OVERDUE: 'overdue'
};

export const ORDER_STATUS_OPTIONS = [
  {label: 'Close', id: 'closed'},
  {label: 'Approve', id: 'borrowing'},
  {label: 'Waiting', id: 'waiting'},
  {label: 'Reject', id: 'rejected'},
  {label: 'Lost', id: 'lost'},
];

export const ORDER_ACTIONS = {
  CREATED: 'created',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXTENDED: 'extended',
  CLOSED: 'closed',
  LOST: 'lost'
};
