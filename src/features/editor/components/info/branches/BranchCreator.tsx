import { Button } from '@/components';
import FormButton from '@/components/common/Buttons/FormButton';
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
  FieldSet
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useCreateBranch from '@/hooks/document/useCreateBranch';
import { createBranchSchema, type TCreateBranchSchema } from '@/types/Branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { GitBranchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  title: string;
}

const BranchCreator = ({ title }: Props) => {
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
      <DialogTrigger asChild>
        <Button>{title}</Button>
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

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button'>Cancel</Button>
            </DialogClose>

            <FormButton
              isPending={isPending}
              isValid={isValid}
              title='Create'
              pendingTitle='Creating'
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchCreator;
