import * as z from 'zod';

export const createBranchSchema = z.object({
  branchName: z
    .string()
    .nonempty('Branch name cannot be empty')
    .max(20, 'Branch name cannot have more than 120 characters'),
});

export type TCreateBranchSchema = z.infer<typeof createBranchSchema>;
