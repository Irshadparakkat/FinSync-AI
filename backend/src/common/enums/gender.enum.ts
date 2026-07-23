/**
 * Gender options for user and member profiles. Cross-cutting (users and
 * members modules both consume it), hence lives in common.
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
