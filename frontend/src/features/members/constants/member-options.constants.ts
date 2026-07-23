import type { Relationship } from '../types/member.types';

export const RELATIONSHIP_OPTIONS: { label: string; value: Relationship }[] = [
  { value: 'SELF', label: 'Self' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'SON', label: 'Son' },
  { value: 'DAUGHTER', label: 'Daughter' },
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'BROTHER', label: 'Brother' },
  { value: 'SISTER', label: 'Sister' },
  { value: 'GRANDFATHER', label: 'Grandfather' },
  { value: 'GRANDMOTHER', label: 'Grandmother' },
  { value: 'OTHER', label: 'Other' },
];

export const relationshipLabel = (value: Relationship): string =>
  RELATIONSHIP_OPTIONS.find((option) => option.value === value)?.label ?? value;
