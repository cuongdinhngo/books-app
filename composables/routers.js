export const useRouters = () => {
  const routes = [
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

  const getRouteByLabelPath = (labelPath) => {
    if (!labelPath) return undefined;
    
    const labels = labelPath.split('.');
    let currentLevel = routes;

    for (const label of labels) {
      const foundItem = currentLevel?.find(item => item.label === label);
      if (!foundItem) return undefined;

      if (label !== labels[labels.length - 1]) {
        currentLevel = foundItem.children;
      } else {
        return foundItem;
      }
    }

    return undefined;
  };

  const getRouteByName = (name) => {
    const search = (items) => {
      for (const item of items) {
        if (item.name === name) return item;
        if (item.children) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return search(routes);
  };

  const getRouteByTo = (wantedTo) => {
    const search = (items) => {
      for (const item of items) {
        if (item.to === wantedTo || item.to === wantedTo) return item;
        if (item.children) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return search(routes);
  };

  const getBreadcrumbs = (currentPath) => {
    // Default to Home if no path or invalid path
    if (!currentPath || typeof currentPath !== 'string') {
      return [getRouteByLabelPath('Home')];
    }

    const breadcrumbs = [getRouteByLabelPath('Home')];

    const findMatchingRoute = (items, path, parents = []) => {
      // Safeguard against invalid items
      if (!Array.isArray(items)) return null;
      
      // Normalize path safely
      const normalizePath = (p) => {
        if (!p || typeof p !== 'string') return '';
        return p.replace(/\/+$/, '');
      };

      const normalizedPath = normalizePath(path);
      
      for (const item of items) {
        // Safely handle missing path in route definition
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
    routes,
    getRouteByLabelPath,
    getRouteByName,
    getRouteByTo,
    getBreadcrumbs
  };
};
