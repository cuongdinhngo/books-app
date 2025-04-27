export const useAuth = () => {
  const supabase = useSupabaseClient();
  const authModel = useSupabaseClient().auth;

  const token = useCookie('token');
  const userId = useCookie('userId');
  const user = ref(null);
  const isAuthenticated = ref(false);
  const error = ref('');
  const userType = useCookie('userType');
  const session = ref([]);

  const signup = (email: string, password: string) => {
    return authModel.signUp({
      email: email,
      password: password
    });
  }

  const signin = async ({ email, password }) => {
    try {
      const { data, error: signInError } = await authModel.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        error.value = 'Invalid email or password. Please try again!';
        return false;
      }

      const { data: user, error: fetchUserError } = await supabase
        .from('users')
        .select()
        .eq('id', data.user.id)
      ;
      if (fetchUserError) throw fetchUserError;
 
      if (user?.length > 0) {
        userType.value = 'staff';
      } else {
        userType.value = 'reader';
      }

      setAuthenticatedUser(data);
      return true;
    } catch (err) {
      console.error('[ERROR] FAIELD: signin ', err);
      error.value = 'Plase try again!';
      return false;
    }
  };

  const signout = async() => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      token.value = null;
      userId.value = null;
      userType.value = null;
      localStorage.removeItem('session');
    } catch(err) {
      console.log('[ERROR] signout: ', err);
    }
  }

  const setToken = (newToken) => {
    token.value = newToken;
    isAuthenticated.value = !!newToken;
  }

  const setAuthenticatedUser = (data) => {
    token.value = data.session.access_token;
    userId.value = data.user.id;
    localStorage.setItem('session', JSON.stringify(data.session));
  }

  return {
    user,
    userId,
    error,
    token,
    session,
    userType,
    isAuthenticated,
    signin,
    signout,
    signup,
    setAuthenticatedUser
  }
}