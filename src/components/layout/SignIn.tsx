import { Input } from '../ui/input';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4'>
      <div className='w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700'>
        <div className='grid md:grid-cols-2 min-h-[600px]'>
          {/* Left Side - Image/Branding */}
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
            <div className='max-w-md w-full mx-auto space-y-8'>
              {/* Header */}
              <div className='text-center md:text-left'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                  Create Your Account
                </h1>
                <p className='text-gray-600 dark:text-gray-400'>
                  Get started with your free account
                </p>
              </div>

              {/* Form */}
              <form method='POST' className='space-y-5'>
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
                      className='pl-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
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
                      className='pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
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
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]'
                >
                  Create Account
                </button>

                {/* Sign In Link */}
                <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                  Don't have an account? &nbsp;
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
      </div>
    </div>
  );
};

export default Signin;
