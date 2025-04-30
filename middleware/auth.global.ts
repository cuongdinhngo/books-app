export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const isAdminRoute = to.path.includes('/admin');
  const isLoginRoute = to.path === '/login';
  const isAuthenticated = !!auth.userId.value;

  if (!isAuthenticated && !isLoginRoute) {
    return navigateTo('/login');
  }
  
  if (isAuthenticated && isLoginRoute) {
    return navigateTo('/');
  }
  
  if (isAuthenticated && isAdminRoute) {
    return auth.userType.value === 'staff' ? undefined : navigateTo('/');
  }

  return;
})