import { Button } from '@/components';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUpdateDocumentInfo } from '@/hooks/document';
import type { Document } from '@/models/Document';
import {
  documentInfoEditorSchema,
  type TDocumentInfoEditorSchema,
} from '@/types/Document';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface Props {
  document: Document;
}

const InfoEditor = ({ document }: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid, errors },
  } = useForm<TDocumentInfoEditorSchema>({
    resolver: zodResolver(documentInfoEditorSchema),
  });
  const { mutate, isPending } = useUpdateDocumentInfo(document.id);

  const onSubmit: SubmitHandler<TDocumentInfoEditorSchema> = (data) =>
    mutate(data);

  return (
    <div className='bg-gray-50 dark:bg-gray-900 w-full p-5 border border-gray-200 dark:border-gray-700 rounded-2xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Edit Information</FieldLegend>
            <FieldDescription>
              Edit all the document information
            </FieldDescription>
            <FieldGroup>
              <div className='grid md:grid-cols-2 gap-2'>
                <Field>
                  <FieldLabel htmlFor='checkout-7j9-card-name-43j'>
                    Document Title
                  </FieldLabel>
                  <Input placeholder={document.title} {...register('title')} />
                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation='horizontal'>
            <Button type='submit' disabled={!isValid || isPending}>
              {isPending ? (
                <div className='flex items-center justify-center gap-2'>
                  <LoaderCircle className='w-5 h-5 animate-spin' />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update'
              )}
            </Button>
            <Button type='button' onClick={() => reset()}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default InfoEditor;
