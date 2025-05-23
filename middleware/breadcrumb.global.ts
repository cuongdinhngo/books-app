import { fa, tr } from "@faker-js/faker";

export default defineNuxtRouteMiddleware(async(to, from) => {
  const { addBreadcrumb, resetBreadcrumbs, setBreadcrumbs } = useBreadcrumbs();
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
    async () => {
      setBreadcrumbs([
        {
          label: 'Categories',
          icon: 'lucide:book',
          to: { name: 'explore-type', params: { type: 'categories' } },
        },
        {
          label: 'Publishers',
          icon: 'lucide:building-2',
          to: { name: 'explore-type', params: { type: 'publishers' } },
        },
        {
          label: 'Authors',
          icon: 'lucide:user',
          to: { name: 'explore-type', params: { type: 'authors' } },
          class: 'text-(--ui-text-muted) hover:text-(--ui-text)'
        }
      ]);
      return null;
    }
  );


})