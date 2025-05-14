export interface AuthorOptions {
  columns?: string,
  ids?: (string | number)[],
  full_name?: string,
  page?: number,
  size?: number
}

export interface PublisherOptions {
  columns?: string,
  ids?: (string | number)[],
  name?: string,
  page?: number,
  size?: number
}

export interface CategoryOptions {
  columns?: string,
  ids?: (string | number)[],
  name?: string
  page?: number,
  size?: number
}

export interface BookOptions {
  columns?: string,
  ids?: (string | number)[],
  title?: string,
  authorIds?: (number)[],
  publisherIds?: (number)[],
  categoryIds?: (number)[],
  status?: (string)[],
  page?: number,
  size?: number
}

export interface NotificationOptions {
  column?: string,
  id?: number,
  readerId?: string,
  type?: string,
  isRead?: boolean,
  notifiableId?: number,
  notifiableType?: string,
  page?: number,
  size?: number
}

export interface OrderRenewOptions {
  columns?: string,
  orderId?: number,
  readerId?: string,
  isHead?: boolean
}

export interface UserOptions {
  columns?: string,
  id?: string,
  name?: string,
  email?: string,
  role?: string,
  page?: number,
  size?: number
}

export interface OrderOptions {
  columns?: string,
  id?: number,
  readerId?: string,
  bookId?: number,
  bookCopyId?: number,
  status?: (string)[],
  from?: string,
  to?: string,
  isOverdue?: boolean,
  isHead?: boolean,
  createdAt?: string,
  page?: number,
  size?: number
}

export interface OrderTimelineOptions {
  columns?: string,
  id?: number,
  orderId?: number
}

export interface WishlistOptions {
  columns?: string,
  id?: number,
  readerId?: number,
  bookId?: number,
  page?: number,
  size?: number
}