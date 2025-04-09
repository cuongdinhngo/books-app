export const useAuth = () => {
  const token = useCookie('token');
  const user = useState('user', () => null);
  const isAuthenticated = useState('isAuthenticated', () => false);
  const apiPath = useRuntimeConfig().public.apiPath;
  const beAppUrl = useRuntimeConfig().public.beAppUrl;

  const userModel = useSupabaseClient().from('users');
  const authModel = useSupabaseClient().auth;

  const signin = async ({ email, password }) => {
    try {
      const { data: userInfo, error: signInError } = await authModel.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return { code: 401, message: "Invalid email or password" };
      }

      setToken(userInfo.session.access_token)
      return { code: 200, data: userInfo.user};
    } catch (error) {
      return { code: 500, message: "Something went wrong" };
    }
  };

  const setToken = (newToken) => {
    token.value = newToken;
    isAuthenticated.value = !!newToken;
  }

  const login = async(formData) => {
    try {
      const response = await $fetch(`${apiPath}/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('response -> ', response);
      if (response.token) {
        setToken(response.token)
      }
    } catch(error) {
      console.log('[ERROR] login: ', error);
    }
  }

  const logout = async () => {
    await $fetch(`${apiPath}/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    setToken(null)
    user.value = null
  }

  const fetchUser = async () => {
    try {
      user.value = await $fetch(`${apiPath}/user`, {
        credentials: 'include'
      })
    } catch (error) {
      setToken(null)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    signin
  }
}