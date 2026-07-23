import type { Gender, UserRole } from '@/types/auth.types';

/** Shared enum -> select-option mappings (profile + members forms). */

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

/** Family-scoped roles only - SUPER_ADMIN is a platform role. */
export const MEMBER_ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { value: 'FAMILY_MEMBER', label: 'Family Member' },
  { value: 'FAMILY_OWNER', label: 'Family Owner' },
];
