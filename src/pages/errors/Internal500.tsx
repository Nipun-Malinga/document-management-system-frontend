import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Internal500 = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center'>
        <div className='flex justify-center mb-8'>
          <div className='p-6 bg-red-50 dark:bg-red-900/20 rounded-full'>
            <AlertCircle className='w-24 h-24 text-red-600 dark:text-red-400' />
          </div>
        </div>

        <h1 className='text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4'>
          500
        </h1>

        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          Server Error
        </h2>

        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
          Oops! Something went wrong on our end. We're working to fix the issue.
          Please try again later.
        </p>

        <div className='mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg max-w-md mx-auto'>
          <p className='text-sm text-amber-800 dark:text-amber-200 font-medium'>
            Our team has been notified and is working on a fix.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <button
            onClick={handleRefresh}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 active:scale-95'
          >
            <RefreshCw className='w-5 h-5' />
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
          >
            <Home className='w-5 h-5' />
            Go Home
          </button>
        </div>

        {/* Help Text */}
        <p className='mt-12 text-sm text-gray-500 dark:text-gray-400'>
          Error persisting?{' '}
          <a
            href='#'
            className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
          >
            Report this issue
          </a>
        </p>
      </div>
    </div>
  );
};

export default Internal500;
