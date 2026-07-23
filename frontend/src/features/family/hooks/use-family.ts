import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEYS } from '@/features/auth';
import { useAuthStore } from '@/stores/auth.store';
import { familyApi } from '../api/family.api';

export const FAMILY_QUERY_KEYS = {
  me: ['family', 'me'] as const,
};

/** The caller's workspace; only fetched once the user belongs to one. */
export function useMyFamily() {
  const familyId = useAuthStore((state) => state.user?.familyId);

  return useQuery({
    queryKey: FAMILY_QUERY_KEYS.me,
    queryFn: familyApi.getMyFamily,
    enabled: Boolean(familyId),
  });
}

/**
 * Workspace creation changes the PRINCIPAL too (familyId + owner role),
 * so both the family cache and the auth profile are refreshed.
 */
export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.createFamily,
    onSuccess: (family) => {
      queryClient.setQueryData(FAMILY_QUERY_KEYS.me, family);
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}

export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familyApi.updateFamily,
    onSuccess: (family) => {
      queryClient.setQueryData(FAMILY_QUERY_KEYS.me, family);
    },
  });
}
