import type { Gender, UserRole } from '@/types/auth.types';
import type { PaginationQuery } from '@/types/api.types';

/** Mirrors backend MemberResponseDto / member DTOs. */

export type Relationship =
  | 'SELF'
  | 'SPOUSE'
  | 'SON'
  | 'DAUGHTER'
  | 'FATHER'
  | 'MOTHER'
  | 'BROTHER'
  | 'SISTER'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'OTHER';

export interface Member {
  id: string;
  familyId: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: Gender;
  relationship: Relationship;
  dateOfBirth: string;
  /** Derived by the API from dateOfBirth; never stored. */
  age: number;
  occupation: string | null;
  monthlyIncome: number;
  profileImage: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberPayload {
  name: string;
  relationship: Relationship;
  gender: Gender;
  dateOfBirth: string;
  occupation?: string;
  monthlyIncome?: number;
  phone?: string;
  email?: string;
  profileImage?: string;
  role?: UserRole;
  isActive?: boolean;
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>;

export interface MemberListQuery extends PaginationQuery {
  search?: string;
  relationship?: Relationship;
  isActive?: boolean;
}
