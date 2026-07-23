import { apiClient, unwrap, unwrapPaginated } from '@/lib/api-client';
import type { MessageResponse } from '@/types/auth.types';
import type {
  CreateMemberPayload,
  Member,
  MemberListQuery,
  UpdateMemberPayload,
} from '../types/member.types';

/** All HTTP calls of the members feature - one place, fully typed. */
export const membersApi = {
  getMembers: (query: MemberListQuery) =>
    unwrapPaginated<Member>(apiClient.get('/members', { params: query })),

  getMember: (id: string): Promise<Member> => unwrap(apiClient.get(`/members/${id}`)),

  createMember: (payload: CreateMemberPayload): Promise<Member> =>
    unwrap(apiClient.post('/members', payload)),

  updateMember: (id: string, payload: UpdateMemberPayload): Promise<Member> =>
    unwrap(apiClient.put(`/members/${id}`, payload)),

  deleteMember: (id: string): Promise<MessageResponse> =>
    unwrap(apiClient.delete(`/members/${id}`)),
};
