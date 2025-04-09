export function filterEmptyValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      return value !== null && 
             value !== undefined && 
             value !== '' &&
             !(Array.isArray(value) && value.length === 0);
    })
  );
}

export function removeObjectById(array, idToRemove) {
  return array.filter(item => item.id !== idToRemove);
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getNewPage(currentPage, totalItem, itemsPerPage) {
  const isLastItemOnPage = (totalItem % itemsPerPage === 1);
  const isLastPage = currentPage === Math.ceil(totalItem / itemsPerPage);
  let redirectPage = currentPage;
  if (isLastItemOnPage && isLastPage && currentPage > 1) {
    redirectPage = currentPage - 1;
  }

  return redirectPage;
}