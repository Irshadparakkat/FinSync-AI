import { z } from 'zod';

/** Mirrors backend UpdateProfileDto validation. */
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be at most 80 characters'),
  phone: z
    .string()
    .regex(/^\+?[0-9()\s-]{7,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine((value) => !value || new Date(value).getTime() <= Date.now(), {
      message: 'Date of birth cannot be in the future',
    }),
  profileImage: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
