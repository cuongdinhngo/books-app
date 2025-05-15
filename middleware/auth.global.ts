export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const isStaff = auth.userRole.value === 'staff';
  const isAdminRoute = to.path.includes('/admin');
  const isLoginRoute = to.path === '/login';
  const isAuthenticated = !!auth.userId.value;
  const publicRoutes = ["/", "/login", "/signup", "/book/"];

  if (!isStaff && isAdminRoute) {
    return navigateTo('/');
  }

  if (publicRoutes.some(route => to.path.startsWith(route))) {
    return;
  }

  if (!isAuthenticated && !isLoginRoute) {
    return navigateTo('/login');
  }
  
  if (isAuthenticated && isLoginRoute) {
    return navigateTo('/');
  }
  
  if (isAuthenticated && isAdminRoute) {
    return auth.userRole.value === 'staff' ? undefined : navigateTo('/');
  }

  return;
})