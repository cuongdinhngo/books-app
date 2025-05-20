export default defineNuxtRouteMiddleware(async(to, from) => {
  const { addBreadcrumb, resetBreadcrumbs } = useBreadcrumbs();
  const isAdminRoute = to.path.includes('/admin');
  const isBookDetailRoute = to.name ===  'book-id';
  const isIndexRoute = to.name === 'index';
  const currentQueries = Object.keys(to.query);
  const isExistedQueries = currentQueries.filter(query => ['author', 'category', 'publisher'].includes(query)).length > 0

  if (
    isAdminRoute ||
    isBookDetailRoute ||
    ( isIndexRoute && isExistedQueries )
  ) {
    return;
  }

  resetBreadcrumbs();

  useAsyncData(
    `${ to.name }/default-breadcrumb`,
    async() => {
      const [categories, publishers, authors ] = await Promise.all([
        useCategories().index(),
        usePublishers().index(),
        useAuthors().index()
      ]);

      if (categories.data && categories.data.length > 0) {
        addBreadcrumb({
          slot: 'dropdown' as const,
          label: 'Categories',
          icon: 'lucide:book',
          children: categories.data.map((category) => ({
            label: category.name,
            to: { name: 'index', query: { category: category.id } }
          }))
        });
      }

      if (publishers.data && publishers.data.length > 0) {
        addBreadcrumb({
          slot: 'dropdown' as const,
          label: 'Publishers',
          icon: 'lucide:building-2',
          children: publishers.data.map((publisher) => ({
            label: publisher.name,
            to: { name: 'index', query: { publisher: publisher.id } }
          }))
        });
      }

      if (authors.data && authors.data.length > 0) {
        addBreadcrumb({
          slot: 'dropdown' as const,
          label: 'Authors',
          icon: 'lucide:user',
          children: authors.data.map((author) => ({
            label: author.full_name,
            to: { name: 'index', query: { author: author.id } }
          }))
        });
      } 
    }
  );
})