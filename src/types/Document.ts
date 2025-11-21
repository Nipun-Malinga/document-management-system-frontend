import * as z from 'zod';

export const documentInfoEditorSchema = z.object({
  title: z
    .string()
    .nonempty('Title cannot be empty')
    .max(120, 'Title cannot have more than 120 characters'),
});

export type TDocumentInfoEditorSchema = z.infer<
  typeof documentInfoEditorSchema
>;
