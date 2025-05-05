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