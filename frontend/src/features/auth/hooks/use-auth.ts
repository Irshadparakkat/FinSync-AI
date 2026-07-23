import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '../api/auth.api';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
};

/** Login mutation: on success the session lands in the auth store. */
export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
    },
  });
}

/** Register mutation: backend returns a message; user logs in afterwards. */
export function useRegister() {
  return useMutation({ mutationFn: authApi.register });
}

/** Fresh profile from the API; only runs when a session exists. */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      setUser(user); // keep the persisted store in sync with the API
      return user;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Logout: invalidates the refresh token server-side, then clears local
 * state REGARDLESS of the API result - the user is always logged out
 * locally even if the network call fails.
 */
export function useLogout() {
  const clearSession = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      queryClient.clear(); // no cached tenant data may survive a logout
    },
  });
}
