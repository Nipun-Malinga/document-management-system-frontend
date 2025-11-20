import * as z from 'zod';

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
};

export const signInSchema = z.object({
  email: z
    .email()
    .nonempty('Email cannot be empty')
    .max(30, 'Email cannot have more than 30 characters'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .max(20, 'Password cannot have more than 20 characters'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
