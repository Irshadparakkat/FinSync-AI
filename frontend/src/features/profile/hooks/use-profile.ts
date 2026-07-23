import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEYS } from '@/features/auth';
import { useAuthStore } from '@/stores/auth.store';
import { profileApi } from '../api/profile.api';

export const PROFILE_QUERY_KEYS = {
  me: ['profile', 'me'] as const,
};

/** Full profile (includes derived age) from /users/me. */
export function useMyProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.me,
    queryFn: profileApi.getMyProfile,
  });
}

/**
 * Profile updates flow back into the auth store so the shell (header
 * name/avatar) updates instantly, plus both profile caches refresh.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: profileApi.updateMyProfile,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(PROFILE_QUERY_KEYS.me, user);
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}
