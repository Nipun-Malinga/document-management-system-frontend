import { useSignIn, useUser } from '@/hooks/user';
import { signInSchema, type SignInSchema } from '@/types/SignIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/common/AuthContainer';
import Button from '../components/common/Button';
import Error from '../components/common/Error';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../components/ui/field';
import { Input } from '../components/ui/input';

const Signin = () => {
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
        navigate('/dashboard/home');
      },
      onError: (error: any) => {
        const status = error.response?.status;
        if (status === 401) setApiError('Invalid email or password.');
        else setApiError('Something went wrong please try again.');
      },
    });
  };

  if (user) navigate('/dashboard/home');

  return (
    <AuthContainer>
      <div className='grid md:grid-cols-2 min-h-[600px]'>
        {/* Left Side */}
        <div className='hidden md:flex flex-col justify-center items-center bg-linear-to-br from-blue-600 to-blue-800 p-12 text-white'>
          <div className='space-y-6 text-center'>
            <div className='w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto'>
              <User className='w-10 h-10' />
            </div>
            <h2 className='text-4xl font-bold'>Welcome back!</h2>
            <p className='text-blue-100 text-lg'>
              Sign in to access your documents and keep working where you left
              off.
            </p>
            <div className='flex gap-8 justify-center mt-8'>
              <div className='text-center'>
                <div className='text-3xl font-bold'>10K+</div>
                <div className='text-sm text-blue-200'>Active Users</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold'>50K+</div>
                <div className='text-sm text-blue-200'>Documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='flex flex-col justify-center p-8 md:p-12'>
          <div className='max-w-md w-full mx-auto space-y-5'>
            {apiError && <Error error={apiError} />}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
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
                          autoComplete='new-password'
                          className='pl-10 pr-10'
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

                      {errors.password && (
                        <FieldError>{errors.password.message}</FieldError>
                      )}

                      <div className='flex justify-end'>
                        <a
                          href='#'
                          className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium'
                        >
                          Forgot password?
                        </a>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <Field>
                  <Button
                    type='submit'
                    disabled={isPending || !isValid}
                    className='w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-150 border border-blue-200 dark:border-blue-800 disabled:border-gray-200 dark:disabled:border-gray-700 active:scale-95 disabled:active:scale-100'
                  >
                    {isPending ? (
                      <>
                        <div className='w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin' />
                        Signing in...
                      </>
                    ) : (
                      <>Sign In</>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
            <div className='flex items-center justify-center'>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?&nbsp;
                <a
                  onClick={() => navigate('/auth/registration')}
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer'
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Signin;
