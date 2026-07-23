import { z } from 'zod';

/** Mirrors backend CreateFamilyDto validation. */
export const familySchema = z.object({
  familyName: z
    .string()
    .min(2, 'Family name must be at least 2 characters')
    .max(60, 'Family name must be at most 60 characters'),
  currency: z.string().length(3, 'Select a currency'),
  country: z.string().length(2, 'Select a country'),
  timezone: z.string().min(1, 'Select a timezone'),
});

export type FamilyFormValues = z.infer<typeof familySchema>;
