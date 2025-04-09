export const useUsers = () => {
  const runtimeConfig = useRuntimeConfig();
  const apiPath = runtimeConfig.public.apiPath;
  const currentUser = useState('currentUser', () => null);
  const currentToken = useState('currentToken', () => null);

  // if (process.client) {
  //   const storedUser = localStorage.getItem('currentUser');
  //   if (storedUser) {
  //     currentUser.value = JSON.parse(storedUser);
  //     currentToken.value = localStorage.getItem('currentToken');
  //   }
  // }

  const storeUser = (data, token) => {
    localStorage.setItem('currentUser', JSON.stringify(data));
    localStorage.setItem('currentToken', token);
  }

  const login = async(formData) => {
    try {
      const data = await $fetch(`${apiPath}/login`, {
        method: 'POST',
        body: formData,
      });

      return data;
    } catch(error) {
      console.log('[ERROR] login: ', error);
    }
  }

  return {
    login,
    storeUser,
    currentUser,
    currentToken
  }
}