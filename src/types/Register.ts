import * as z from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .nonempty('First name cannot be empty')
      .max(15, 'First name cannot have more than 15 characters'),
    lastName: z.string(),
    username: z
      .string()
      .nonempty('Username cannot be empty')
      .min(3, 'Username must have at least 3 characters')
      .max(15, 'Username cannot have more than 20 characters'),
    email: z
      .email()
      .nonempty('Email cannot be empty')
      .max(30, 'Email cannot have more than 30 characters'),
    password: z
      .string()
      .min(8, 'Password must have at least 8 characters')
      .max(20, 'Password cannot have more than 20 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must have at least 8 characters')
      .max(20, 'Password cannot have more than 20 characters'),
    acceptTerms: z.literal(true, {
      error: 'Must accept terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Password must match',
    path: ['confirmPassword'],
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;
