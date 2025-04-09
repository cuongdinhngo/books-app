export const useSettings = () => {
  const runtimeConfig = useRuntimeConfig();
  const apiPath = runtimeConfig.public.apiPath;
  const photoPath = runtimeConfig.public.photoPath;
  let currentToken = null;

  if (process.client) {
    currentToken = localStorage.getItem('currentToken') || null;
  }

  return {
    currentToken,
    apiPath,
    photoPath
  }
}