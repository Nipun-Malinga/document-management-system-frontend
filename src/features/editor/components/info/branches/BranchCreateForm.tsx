import { Button } from '@/components';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useCreateBranch from '@/hooks/document/useCreateBranch';
import { createBranchSchema, type TCreateBranchSchema } from '@/types/Branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { GitBranchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const CreateBranchForm = () => {
  const { documentId, branchId } = useParams();
  const navigate = useNavigate();

  if (!documentId || !branchId) {
    navigate('/dashboard/home', { replace: true });
    return null;
  }

  const { mutate, isPending } = useCreateBranch(documentId, branchId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TCreateBranchSchema>({
    resolver: zodResolver(createBranchSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: TCreateBranchSchema) => {
    mutate({ branchName: data.branchName }, { onSuccess: () => reset() });
  };

  return (
    <Dialog>
      <DialogTrigger asChild className='w-full'>
        <Button className='w-full'>Create Branch</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Create a new branch</DialogTitle>
        <DialogDescription>Enter a name for the new branch.</DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Create a new branch</FieldLegend>

              <Field>
                <FieldLabel>Branch name</FieldLabel>
                <div className='relative'>
                  <GitBranchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <Input
                    type='text'
                    className='pl-10'
                    {...register('branchName')}
                  />
                </div>

                {errors.branchName && (
                  <FieldError>{errors.branchName.message}</FieldError>
                )}
              </Field>
            </FieldSet>
          </FieldGroup>

          <DialogFooter className='mt-3'>
            <DialogClose asChild>
              <Button type='button'>Cancel</Button>
            </DialogClose>

            <Button
              type='submit'
              disabled={!isValid}
              className='flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-150 border border-red-200 dark:border-red-800 disabled:border-gray-200 dark:disabled:border-gray-700 active:scale-95 disabled:active:scale-100'
            >
              {isPending ? (
                <>
                  <div className='w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin' />
                  Creating...
                </>
              ) : (
                <>Create</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBranchForm;
