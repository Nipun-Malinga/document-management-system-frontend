import { Button } from '@/components';
import { useSignIn, useUser } from '@/hooks/user';
import { signInSchema, type SignInSchema } from '@/types/SignIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/common/AuthContainer';
import Error from '../../components/common/Error';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '../../components/ui/field';
import { Input } from '../../components/ui/input';

const AdminSignin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useSignIn();
  const user = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SignInSchema> = (data) => {
    setApiError(null);
    mutate(data, {
      onSuccess: () => {
        if (user && user.role == 'ADMIN') navigate('/admin/dashboard');
      },
      onError: (error: any) => {
        const status = error.response?.status;
        if (status === 401) setApiError('Invalid email or password.');
        else setApiError('Something went wrong. Please try again.');
      },
    });
  };

  if (user && user.role == 'ADMIN') navigate('/admin/dashboard');

  return (
    <AuthContainer>
      <div className='min-h-[600px] flex items-center justify-center py-8'>
        <div className='max-w-md w-full space-y-6'>
          {apiError && <Error error={apiError} />}
          
          <div className='text-center'>
            <div className='inline-flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4'>
              <LogIn className='w-8 h-8 text-blue-600 dark:text-blue-400' />
            </div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
              Admin Sign In
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Error Message */}
          {apiError && <Error error='Sign In Failed' />}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <Input
                      type='email'
                      placeholder='admin@example.com'
                      autoComplete='email'
                      className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                          : 'focus:ring-blue-500'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='current-password'
                      className={`pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                        errors.password
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                          : 'focus:ring-blue-500'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </Field>

                {/* Forgot Password Link */}
                <div className='flex justify-end'>
                  <a
                    href='#'
                    className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium'
                  >
                    Forgot password?
                  </a>
                </div>
              </FieldSet>
            </FieldGroup>

            <button
              type='submit'
              disabled={isPending || !isValid}
              className='w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-150 border border-blue-200 dark:border-blue-800 disabled:border-gray-200 dark:disabled:border-gray-700 active:scale-95 disabled:active:scale-100'
            >
              {isPending ? (
                <>
                  <div className='w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin' />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className='w-5 h-5' />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthContainer>
  );
};

export default AdminSignin;
