export const BOOK_COPY_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost',
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available'
};

export const BOOK_COPY_OPTION = [
  { id: BOOK_COPY_STATUS.PENDING, label: capitalize(BOOK_COPY_STATUS.PENDING) },
  { id: BOOK_COPY_STATUS.OPENING, label: capitalize(BOOK_COPY_STATUS.OPENING) },
  { id: BOOK_COPY_STATUS.BORROWING, label: capitalize(BOOK_COPY_STATUS.BORROWING) },
  { id: BOOK_COPY_STATUS.LOST, label: capitalize(BOOK_COPY_STATUS.LOST) },
];
