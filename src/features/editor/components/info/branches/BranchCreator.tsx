import { Button } from '@/components';
import FormButton from '@/components/common/Buttons/FormButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
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
import useCreateBranch from '@/hooks/document/useCreateBranch';
import { createBranchSchema, type TCreateBranchSchema } from '@/types/Branch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  title: string;
}

const BranchCreator = ({ title }: Props) => {
  const { documentId, branchId } = useParams();
  const navigate = useNavigate();

  if (!documentId || !branchId) {
    navigate('/dashboard/home');
    return;
  }

  const { mutate, isPending } = useCreateBranch(documentId, branchId);

  const {
    //
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Sign In</FieldLegend>
              <FieldDescription>
                Welcome back! Please enter your details
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <Input
                      type='email'
                      placeholder='john.doe@example.com'
                      autoComplete='email'
                      className='pl-10'
                      {...register('branchName')}
                    />
                  </div>
                  {errors.branchName && (
                    <FieldError>{errors.branchName.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
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
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default BranchCreator;
