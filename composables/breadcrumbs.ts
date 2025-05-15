import type { BreadcrumbItem } from '@nuxt/ui';

const homeBreadcrumb: BreadcrumbItem = {
  label: 'Home',
  icon: 'lucide-house',
  to: { name: 'index' }
};

export const breadcrumbItems = ref<BreadcrumbItem[]>([ homeBreadcrumb ]); 

export const useBreadcrumbs = () => {

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    if (items.length > 0 && items[0].label !== 'Home') {
      breadcrumbItems.value = [
        homeBreadcrumb,
        ...items
      ];
    } else {
      breadcrumbItems.value = items;
    }
  };

  const addBreadcrumb = (item: BreadcrumbItem) => {
    if (!breadcrumbItems.value.some(i => i.label === item.label)) {
      breadcrumbItems.value.push(item);
    }
  };

  const resetBreadcrumbs = () => {
    breadcrumbItems.value = [homeBreadcrumb];
  };

  return {
    breadcrumbItems,
    setBreadcrumbs,
    addBreadcrumb,
    resetBreadcrumbs
  };
};
