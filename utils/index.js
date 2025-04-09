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