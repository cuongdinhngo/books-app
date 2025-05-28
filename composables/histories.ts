export interface HistoryItems {
  key: string;
  items: string[];
}

export const useHistories = () => {
  const histories = ref<HistoryItems[]>([]);

  const store = (key: string, items: string[]) => {
    if (items.length === 0) {
      return;
    }

    histories.value = JSON.parse(localStorage.getItem('histories') || '[]');
    const existingIndex = histories.value.findIndex((item) => item.key === key);
    if (existingIndex !== -1) {
      const existingItems = histories.value[existingIndex].items;
      if (items.length === 1 && !existingItems.includes(items[0])) {
        histories.value[existingIndex].items = [...existingItems, items[0]];
      } else if (items.length > 1) {
        const uniqueNewItems = items.filter(item => !existingItems.includes(item));
        histories.value[existingIndex].items = [...existingItems, ...uniqueNewItems];
      }
    } else {
      histories.value.push({ key, items });
    }

    localStorage.setItem('histories', JSON.stringify(histories.value));
  }

  const get = (key: string): string[] => {
    histories.value = JSON.parse(localStorage.getItem('histories') || '[]');
    const history = histories.value.find((item) => item.key === key);

    return history ? history.items : [];
  }

  return {
    histories,
    store,
    get,
  }
}