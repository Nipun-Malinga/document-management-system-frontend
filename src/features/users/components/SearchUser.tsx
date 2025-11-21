import { Button } from '@/components';
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useFindUser } from '@/hooks/user';
import { userSchema, type TUserSchema } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoaderCircle,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface Props {
  title: string;
  subTitle: string;
  onClick: (userId: number) => void;
  userPending: boolean;
}

const SearchUser = ({ title, subTitle, onClick, userPending }: Props) => {
  const [email, setEmail] = useState<string>('');
  const { data: user } = useFindUser(email);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isReady },
  } = useForm<TUserSchema>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<TUserSchema> = (data) => {
    setEmail(data.email);
  };

  return (
    <div className='bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg'>
          <UserPlus className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
        </div>
        <div>
          <h3 className='text-base font-bold text-gray-900 dark:text-gray-100'>
            {title}
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>{subTitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{title}</FieldLegend>
            <FieldDescription>{subTitle}</FieldDescription>
            <FieldGroup>
              <div className='grid md:grid-cols-2 gap-2'>
                <Field>
                  <FieldLabel htmlFor='checkout-7j9-card-name-43j'>
                    User email
                  </FieldLabel>
                  <Input placeholder={document.title} {...register('email')} />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation='horizontal'>
            <Button type='submit' disabled={!isReady}>
              Submit
            </Button>
            <Button type='button' onClick={() => reset()}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Search Result */}
      {user && (
        <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                  {user.email}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  User found
                </p>
              </div>
            </div>
            <Button
              onClick={() => onClick(user.id)}
              className='px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm hover:shadow-md active:scale-95'
            >
              {userPending ? (
                <LoaderCircle className='w-5 h-5 animate-spin' />
              ) : (
                'Add'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
