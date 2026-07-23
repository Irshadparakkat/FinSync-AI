import type { Gender } from '@/types/auth.types';

/** Mirrors backend UpdateProfileDto. */
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  profileImage?: string;
  country?: string;
  timezone?: string;
}
