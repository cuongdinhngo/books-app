export function filterEmptyValues(obj: Object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      return value !== null && 
             value !== undefined && 
             value !== '' &&
             !(Array.isArray(value) && value.length === 0);
    })
  );
}

export function removeObjectById(array: Array<any>, idToRemove: string|number) {
  return array.filter(item => item.id !== idToRemove);
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getNewPage(currentPage: number, totalItem: number, itemsPerPage: number) {
  if (currentPage < 1 || totalItem < 0 || itemsPerPage < 1) {
    return 1;
  }
  const totalPages = Math.ceil(totalItem / itemsPerPage);

  return Math.min(Math.max(1, currentPage), totalPages);
}

export function readableDateTime(datetime: string) {
  return new Date(datetime).toLocaleString(
    'en-US',
    { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  )
}

export function formatTimeSince(timeAt: string): string {
  const now = new Date();
  const createdDate = new Date(timeAt);
  const diffMs = now.getTime() - createdDate.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(months / 12);
  return `${years}y`;
}

export function publicAsset(path: string) {
  const baseURL = useRuntimeConfig().app.baseURL;

  return `${baseURL}${path}`;
}

export function getDefaultBookCover() {
  return publicAsset('img/cover.jpg');
}

export function getDefaultHumanAvatar() {
  return publicAsset('img/human.jpg');
}

export function generateRating(length: number, filledChar: string = '★', emptyChar: string = '☆') {
  if (length < 0) length = 0;
  if (length > 5) length = 5;

  const filled = filledChar.repeat(length);
  const empty = emptyChar.repeat(5 - length);

  return filled + empty;
}

export function mapBadgeColor(status: string) {
  const color = {
    waiting: 'primary',
    opening: 'success',
    pending: 'primary',
    borrowing: 'warning',
    lost: 'error',
    rejected: 'neutral',
    closed: 'success',
  }

  return color[status] || 'neutral';
}

export function isExistedQueries(queries: string[]) {
  const currentQueries = Object.keys(useRoute().query);
  return currentQueries.filter(query => queries.includes(query)).length > 0;
}

export function isExistedParams() {
  const currentParams = Object.keys(useRoute().params);
  return currentParams.length > 0;
}

export function getAppPath() {
  const appUrl = useRuntimeConfig().public.appUrl;
  if (!appUrl) {
    throw new Error('App URL is not defined in runtime config.');
  }

  const baseURL = useRuntimeConfig().app.baseURL;
  const fullBaseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;

  return baseURL.endsWith('/') ? `${fullBaseUrl}${baseURL}` : `${fullBaseUrl}${baseURL}/`;
}
