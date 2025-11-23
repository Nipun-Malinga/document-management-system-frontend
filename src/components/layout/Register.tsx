import { useRegistration, useUser } from '@/hooks/user';
import { registerSchema, type TRegisterSchema } from '@/types/Register';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  User,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../common/AuthContainer';
import Button from '../common/Button';
import Error from '../common/Error';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate, isPending } = useRegistration();
  const user = useUser();

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

  if (user) navigate('/dashboard/home');
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
        <div className='flex flex-col justify-center p-8 md:p-12'>
          <div className='max-w-md w-full mx-auto space-y-5'>
            {apiError && <Error error={apiError} />}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Create Your Account</FieldLegend>
                  <FieldDescription>
                    Get started with your free account
                  </FieldDescription>

                  <FieldGroup>
                    {/* First Name & Last Name */}
                    <div className='grid grid-cols-2 gap-4'>
                      <Field>
                        <FieldLabel>First Name</FieldLabel>
                        <Input placeholder='John' {...register('firstname')} />
                        {errors.firstname && (
                          <FieldError>{errors.firstname.message}</FieldError>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel>Last Name</FieldLabel>
                        <Input placeholder='Doe' {...register('lastname')} />
                        {errors.lastname && (
                          <FieldError>{errors.lastname.message}</FieldError>
                        )}
                      </Field>
                    </div>

                    {/* Username */}
                    <Field>
                      <FieldLabel>Username</FieldLabel>
                      <div className='relative'>
                        <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                        <Input
                          type='text'
                          placeholder='johndoe'
                          autoComplete='username'
                          className='pl-10'
                          {...register('username')}
                        />
                      </div>
                      {errors.username && (
                        <FieldError>{errors.username.message}</FieldError>
                      )}
                    </Field>

                    {/* Email */}
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

                    {/* Password */}
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
                    </Field>

                    {/* Confirm Password */}
                    <Field>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          autoComplete='new-password'
                          className='pl-10 pr-10'
                          {...register('confirmPassword')}
                        />
                        <button
                          type='button'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <FieldError>
                          {errors.confirmPassword.message}
                        </FieldError>
                      )}
                    </Field>

                    {/* Terms and Conditions */}
                    <Field>
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
                          &nbsp;and&nbsp;
                          <a
                            href='#'
                            className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {errors.acceptTerms && (
                        <FieldError>{errors.acceptTerms.message}</FieldError>
                      )}
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Submit Button */}
                <Field>
                  <Button
                    type='submit'
                    disabled={!isValid || isPending}
                    className='w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:hover:shadow-lg disabled:active:scale-100'
                  >
                    {isPending ? (
                      <div className='flex items-center justify-center gap-2'>
                        <LoaderCircle className='w-5 h-5 animate-spin' />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            {/* Sign In Link */}
            <div className='flex items-center justify-center'>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?&nbsp;
                <a
                  onClick={() => navigate('/auth/signin')}
                  className='text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer'
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default Register;
