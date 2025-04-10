export const useRouters = () => {
  const adminRoutes = [
    {
      label: 'Home',
      name: 'home',
      to: '/admin/',
      icon: 'i-lucide-house'
    },
    {
      label: 'Books',
      name: 'books',
      to: '/admin/books/',
      icon: 'i-lucide-book-open',
      children: [
        {
          label: 'All Books',
          icon: 'lucide:notebook-text',
          name: 'books',
          to: '/admin/books/',
        },
        {
          label: 'Authors',
          icon: 'i-lucide-file-text',
          name: 'authors',
          to: '/admin/authors'
        },
        {
          label: 'Publishers',
          icon: 'i-lucide-swatch-book',
          name: 'publishers',
          to: '/admin/publishers'
        },
        {
          label: 'Categories',
          icon: 'i-lucide-cog',
          name: 'categories',
          to: '/admin/categories'
        }
      ]
    }
  ];



  const getRouteByLabelPath = (routes, labelPath) => {
    if (!labelPath) return null;
    
    const labels = labelPath.split('.');
    let currentLevel = routes;

    for (const label of labels) {
      const foundItem = currentLevel?.find(item => item.label === label);
      if (!foundItem) return null;

      if (label !== labels[labels.length - 1]) {
        currentLevel = foundItem.children;
      } else {
        return foundItem;
      }
    }

    return null;
  };

  const getRouteByName = (routes, name) => {
    const search = (items) => {
      for (const item of items) {
        if (item.name === name) return item;
        if (item.children) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return search(routes);
  };

  const getRouteByTo = (routes, wantedTo) => {
    const search = (items) => {
      for (const item of items) {
        if (item.to === wantedTo || item.to === wantedTo) return item;
        if (item.children) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return search(routes);
  };

  const getBreadcrumbs = (currentPath) => {
    if (!currentPath || typeof currentPath !== 'string') {
      return [getRouteByLabelPath('Home')];
    }

    const breadcrumbs = [getRouteByLabelPath('Home')];

    const findMatchingRoute = (items, path, parents = []) => {
      if (!Array.isArray(items)) return null;
      
      const normalizePath = (p) => {
        if (!p || typeof p !== 'string') return '';
        return p.replace(/\/+$/, '');
      };

      const normalizedPath = normalizePath(path);
      
      for (const item of items) {
        const itemPath = item.to || '';
        if (normalizePath(itemPath) === normalizedPath) {
          return [...parents, item];
        }
        
        if (item.children) {
          const found = findMatchingRoute(item.children, path, [...parents, item]);
          if (found) return found;
        }
      }
      return null;
    };

    const matchedRoutes = findMatchingRoute(routes, currentPath) || [];
    
    matchedRoutes.forEach(route => {
      if (route.to !== '/admin/') {
        breadcrumbs.push({
          label: route.breadcrumb || route.label || 'Untitled',
          to: route.to || '#',
          icon: route.icon || ''
        });
      }
    });

    return breadcrumbs;
  };

  return {
    adminRoutes,
    getRouteByLabelPath,
    getRouteByName,
    getRouteByTo,
    getBreadcrumbs
  };
};
