import { ro } from "@nuxt/ui/runtime/locale/index.js";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const authModel = useSupabaseClient().auth;
  const { get:verifyUser } = useUsers();

  const token = useCookie('token');
  const userId = useCookie('userId', {
    default: () => null
  });
  const user = ref(null);
  const isAuthenticated = ref(false);
  const error = ref('');
  const userRole = useCookie('userRole');
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

      const { data: user, error: fetchUserError } = await verifyUser(data.user.id);
      if (fetchUserError) throw fetchUserError;

      console.log('user: ', user);
      if (user.id) {
        setAuthenticatedUser(data, user.role);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('[ERROR] FAIELD: signin ', err);
      return false;
    }
  };

  const signout = async() => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      token.value = null;
      userId.value = null;
      userRole.value = null;
    } catch(err) {
      console.log('[ERROR] signout: ', err);
    }
  }

  const setAuthenticatedUser = (data: any, role: string = 'reader') => {
    token.value = data.session.access_token;
    userId.value = data.user.id;
    userRole.value = role;
  }

  return {
    user,
    userId,
    error,
    token,
    session,
    userRole,
    isAuthenticated,
    signin,
    signout,
    signup,
    setAuthenticatedUser
  }
}