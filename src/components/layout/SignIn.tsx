import { useSignIn } from '@/hooks/user';
import { signInSchema, type SignInSchema } from '@/types/SignIn';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../common/AuthContainer';
import Button from '../common/Button';
import { Input } from '../ui/input';
import Error from '../common/Error';

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useSignIn();

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
            {/* Header */}
            <div className='text-center md:text-left'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                Sign In
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                Welcome back! Please enter your details
              </p>
            </div>

            {/* API Error Alert */}
            {apiError && <Error error={apiError} />}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              {/* Email */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <Input
                    type='email'
                    placeholder='john.doe@example.com'
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
                  <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm mt-1'>
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    <p>{errors.email.message}</p>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Password
                </label>
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
                  <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm mt-1'>
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    <p>{errors.password.message}</p>
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              <div className='flex items-center justify-end'>
                <a
                  href='#'
                  className='text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium'
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={!isValid || isPending}
                className='w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:hover:shadow-lg disabled:active:scale-100'
              >
                {isPending ? (
                  <div className='flex items-center justify-center gap-2'>
                    <LoaderCircle className='w-5 h-5 animate-spin' />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Register Link */}
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <a
                  onClick={() => navigate('/auth/registration')}
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer'
                >
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Signin;
