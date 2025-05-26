export const BOOK_COPY_STATUS = {
  PENDING: 'pending',
  OPENING: 'opening',
  BORROWING: 'borrowing',
  LOST: 'lost',
  RETIRED: 'retired',
  UNAVAILABLE: 'unavailable', // This status is used when the book copies are lost or retired
  AVAILABLE: 'available', // This status is used when the book copies are pending or opening or borrowing
};

export const BOOK_COPY_OPTION = [
  { id: BOOK_COPY_STATUS.PENDING, label: capitalize(BOOK_COPY_STATUS.PENDING) },
  { id: BOOK_COPY_STATUS.OPENING, label: capitalize(BOOK_COPY_STATUS.OPENING) },
  { id: BOOK_COPY_STATUS.BORROWING, label: capitalize(BOOK_COPY_STATUS.BORROWING) },
  { id: BOOK_COPY_STATUS.LOST, label: capitalize(BOOK_COPY_STATUS.LOST) },
  { id: BOOK_COPY_STATUS.RETIRED, label: capitalize(BOOK_COPY_STATUS.RETIRED) },
];
