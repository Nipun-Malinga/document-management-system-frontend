import * as z from 'zod';

export const createVersionSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must not exceed 50 characters'),

  status: z.enum(['PUBLIC', 'PRIVATE'], 'Select a valid visibility type'),
});

export type TCreateVersionSchema = z.infer<typeof createVersionSchema>;
