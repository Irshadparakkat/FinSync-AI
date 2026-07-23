import { z } from 'zod';

/** Mirrors backend CreateMemberDto validation. */
export const memberSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be at most 80 characters'),
  relationship: z.enum(
    [
      'SELF',
      'SPOUSE',
      'SON',
      'DAUGHTER',
      'FATHER',
      'MOTHER',
      'BROTHER',
      'SISTER',
      'GRANDFATHER',
      'GRANDMOTHER',
      'OTHER',
    ],
    { message: 'Relationship is required' },
  ),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => new Date(value).getTime() <= Date.now(), {
      message: 'Date of birth cannot be in the future',
    }),
  occupation: z.string().max(80, 'Keep it under 80 characters').optional().or(z.literal('')),
  monthlyIncome: z
    .number({ message: 'Enter a valid amount' })
    .min(0, 'Income cannot be negative')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9()\s-]{7,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  profileImage: z.string().optional(),
  role: z.enum(['FAMILY_OWNER', 'FAMILY_MEMBER']),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
