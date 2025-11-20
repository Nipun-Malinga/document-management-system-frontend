import { registerSchema, type TRegisterSchema } from '@/types/Register';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserCircle,
  LoaderCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../common/AuthContainer';
import Button from '../common/Button';
import { Input } from '../ui/input';
import { useRegistration } from '@/hooks/user';
import Error from '../common/Error';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useRegistration();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = (data) =>
    mutate(data, {
      onSuccess: () => navigate('/auth/signin'),
      onError: (error: any) => {
        const status = error.response?.status;

        if (status === 409)
          setApiError('Email already registered in the system.');
        else setApiError('Something went wrong please try again.');
      },
    });

  return (
    <AuthContainer>
      <div className='grid md:grid-cols-2 min-h-[700px]'>
        {/* Left Side*/}
        <div className='hidden md:flex flex-col justify-center items-center bg-linear-to-br from-blue-600 to-blue-800 p-12 text-white'>
          <div className='space-y-6 text-center'>
            <div className='w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto'>
              <UserCircle className='w-10 h-10' />
            </div>
            <h2 className='text-4xl font-bold'>Join Us Today!</h2>
            <p className='text-blue-100 text-lg'>
              Start collaborating, organizing, and managing your documents in
              one place.
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
        <div className='flex flex-col justify-center p-8 md:p-5'>
          <div className='max-w-md w-full mx-auto space-y-6'>
            {/* Header */}
            <div className='text-center md:text-left'>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                Create Your Account
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                Get started with your free account
              </p>
            </div>

            {/* API Error Alert */}
            {apiError && <Error error={apiError}/>}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-2.5 md:space-y-5'
            >
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    First Name
                  </label>
                  <div className='relative'>
                    <Input
                      placeholder='John'
                      className={`pl-4 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                        errors.firstname
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                          : 'focus:ring-blue-500'
                      }`}
                      {...register('firstname')}
                    />
                  </div>
                  {errors.firstname && (
                    <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs mt-1'>
                      <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                      <p>{errors.firstname.message}</p>
                    </div>
                  )}
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Last Name
                  </label>
                  <div className='relative'>
                    <Input
                      placeholder='Doe'
                      className={`pl-4 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                        errors.lastname
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                          : 'focus:ring-blue-500'
                      }`}
                      {...register('lastname')}
                    />
                  </div>
                  {errors.lastname && (
                    <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs mt-1'>
                      <AlertCircle className='w-3.5 h-3.5 shrink-0' />
                      <p>{errors.lastname.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Username */}
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Username
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <Input
                  type='text'
                  placeholder='john doe'
                  autoComplete='username'
                  className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm mt-1'>
                  <AlertCircle className='w-4 h-4 shrink-0' />
                  <p>{errors.username.message}</p>
                </div>
              )}

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
                    autoComplete='new-password'
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

              {/* Confirm Password */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <Input
                    type='password'
                    placeholder='••••••••'
                    autoComplete='new-password'
                    className={`pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm mt-1'>
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    <p>{errors.confirmPassword.message}</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className='space-y-2'>
                <div className='flex items-start gap-2'>
                  <input
                    type='checkbox'
                    id='terms'
                    className='mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    {...register('acceptTerms')}
                  />
                  <label
                    htmlFor='terms'
                    className='text-sm text-gray-600 dark:text-gray-400'
                  >
                    I agree to the&nbsp;
                    <a
                      href='#'
                      className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                    >
                      Terms of Service
                    </a>
                    &nbsp; and&nbsp;
                    <a
                      href='#'
                      className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <div className='flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm'>
                    <AlertCircle className='w-4 h-4 shrink-0' />
                    <p>{errors.acceptTerms.message}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={!isValid}
                className='w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:hover:shadow-lg disabled:active:scale-100'
              >
                {isPending ? (
                  <LoaderCircle className='w-5 h-5 animate-spin' />
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Sign In Link */}
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?&nbsp;
                <a
                  onClick={() => navigate('/auth/signin')}
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer'
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Register;
