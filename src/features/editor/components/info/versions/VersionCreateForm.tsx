import { Button } from '@/components';
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateVersion } from '@/hooks/document';
import {
  createVersionSchema,
  type TCreateVersionSchema,
} from '@/types/Version';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GitBranchIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VersionCreateForm = () => {
  const { documentId, branchId } = useParams();

  if (!documentId || !branchId) {
    throw new Error('Missing documentId or branchId');
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<TCreateVersionSchema>({
    resolver: zodResolver(createVersionSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useCreateVersion(documentId, branchId);

  const onSubmit = (data: TCreateVersionSchema) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full">Create Version</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Create a new version</DialogTitle>
        <DialogDescription>
          Give your version a meaningful name and set its visibility.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Version details</FieldLegend>

              <Field>
                <FieldLabel>Version name</FieldLabel>

                <div className="relative">
                  <GitBranchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    className="pl-10"
                    placeholder="Version name"
                    {...register('title')}
                  />
                </div>

                {errors.title && (
                  <FieldError>{errors.title.message}</FieldError>
                )}
              </Field>
            </FieldSet>
          </FieldGroup>

          <Field>
            <FieldLabel>Visibility</FieldLabel>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibility</SelectLabel>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.status && (
              <FieldError>{errors.status.message}</FieldError>
            )}
          </Field>

          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VersionCreateForm;
