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
    .email({ pattern: z.regexes.html5Email })
    .nonempty('Email cannot be empty'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters')
    .max(20, 'Password cannot have more than 20 characters')
    .refine((value) => value.trim().length > 0, 'Password cannot be blank'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
