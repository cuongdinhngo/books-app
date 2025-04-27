export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const isAdminRoute = to.path.includes('/admin');
  const isLoginRoute = to.path === '/login';
  
  if (isAdminRoute && auth.userType.value === 'staff') {
    return;
  }
  
  if (isAdminRoute && auth.userType.value !== 'staff') {
    if (!isLoginRoute) {
      return navigateTo('/login');
    }
    return;
  }

  if (isLoginRoute && auth.userType.value) {
    return navigateTo('/');
  }
})