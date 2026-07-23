import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FAMILY_QUERY_KEYS } from '@/features/family';
import { membersApi } from '../api/members.api';
import type { MemberListQuery, UpdateMemberPayload } from '../types/member.types';

export const MEMBER_QUERY_KEYS = {
  all: ['members'] as const,
  list: (query: MemberListQuery) => ['members', 'list', query] as const,
  detail: (id: string) => ['members', 'detail', id] as const,
};

export function useMembers(query: MemberListQuery) {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.list(query),
    queryFn: () => membersApi.getMembers(query),
    // Keeps the table stable while a new page/filter loads (no flash)
    placeholderData: keepPreviousData,
  });
}

export function useMember(id: string | null) {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.detail(id ?? ''),
    queryFn: () => membersApi.getMember(id as string),
    enabled: Boolean(id),
  });
}

/** Every mutation refreshes the list AND the family (membersCount). */
function useInvalidateMembers() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    void queryClient.invalidateQueries({ queryKey: FAMILY_QUERY_KEYS.me });
  };
}

export function useCreateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({ mutationFn: membersApi.createMember, onSuccess: invalidate });
}

export function useUpdateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemberPayload }) =>
      membersApi.updateMember(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({ mutationFn: membersApi.deleteMember, onSuccess: invalidate });
}
