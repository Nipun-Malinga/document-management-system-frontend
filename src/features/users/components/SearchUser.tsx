import { Button } from '@/components';
import { Input } from '@/components/ui/input';
import { useFindUser } from '@/hooks/user';
import { userSchema, type TUserSchema } from '@/types/User';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  LoaderCircle,
  Mail,
  Search,
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
    formState: { errors, isValid },
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
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Email Address
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <Input
              {...register('email')}
              placeholder='johndoe@email.com'
              className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>
          {errors.email && (
            <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm'>
              <AlertCircle className='w-4 h-4 shrink-0' />
              <p>{errors.email.message}</p>
            </div>
          )}
        </div>

        <Button
          type='submit'
          disabled={!isValid}
          className='w-full h-11 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:hover:shadow-md disabled:active:scale-100'
        >
          <Search className='w-4 h-4' />
          Search User
        </Button>
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
