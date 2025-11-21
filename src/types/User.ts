import * as z from 'zod';

export const userSchema = z.object({
  email: z.email().nonempty('Email cannot be empty'),
});

export type TUserSchema = z.infer<typeof userSchema>;
