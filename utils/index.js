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

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getNewPage(currentPage, totalItem, itemsPerPage) {
  if (currentPage < 1 || totalItem < 0 || itemsPerPage < 1) {
    return 1;
  }
  const totalPages = Math.ceil(totalItem / itemsPerPage);

  return Math.min(Math.max(1, currentPage), totalPages);
}