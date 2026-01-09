import {
  ArrowLeft,
  FileQuestion,
  Home,
  AlertCircle,
  ServerCrash,
  ShieldAlert,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface Props {
  error: string;
  status: number;
  description?: string;
  showRefresh?: boolean;
}

type ErrorConfig = {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  showStatusBanner?: boolean;
  bannerColor?: string;
  bannerText?: string;
};

const errorConfigs: Record<number, ErrorConfig> = {
  400: {
    icon: ShieldAlert,
    iconBgColor: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Bad Request',
    description:
      'The request could not be understood or was missing required parameters.',
  },
  401: {
    icon: ShieldAlert,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Unauthorized',
    description: 'You need to be authenticated to access this resource.',
  },
  403: {
    icon: ShieldAlert,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Forbidden',
    description: "You don't have permission to access this resource.",
  },
  404: {
    icon: FileQuestion,
    iconBgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    title: 'Page Not Found',
    description:
      "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
  },
  408: {
    icon: Clock,
    iconBgColor: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    title: 'Request Timeout',
    description: 'The request took too long to process. Please try again.',
  },
  500: {
    icon: AlertCircle,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Server Error',
    description:
      "Oops! Something went wrong on our end. We're working to fix the issue.",
    showStatusBanner: true,
    bannerColor:
      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    bannerText: 'Our team has been notified and is working on a fix.',
  },
  502: {
    icon: ServerCrash,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Bad Gateway',
    description:
      'The server received an invalid response. Please try again in a moment.',
    showStatusBanner: true,
    bannerColor:
      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    bannerText: 'We are experiencing connectivity issues.',
  },
  503: {
    icon: ServerCrash,
    iconBgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    title: 'Service Unavailable',
    description:
      'The service is temporarily unavailable. Please try again later.',
    showStatusBanner: true,
    bannerColor:
      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    bannerText: 'The service is currently under maintenance.',
  },
};

const Error = ({ error, status, description, showRefresh = false }: Props) => {
  const navigate = useNavigate();

  const config = errorConfigs[status] || {
    icon: AlertCircle,
    iconBgColor: 'bg-gray-50 dark:bg-gray-900/20',
    iconColor: 'text-gray-600 dark:text-gray-400',
    title: 'Error',
    description: 'An unexpected error occurred. Please try again.',
  };

  const Icon = config.icon;
  const displayDescription = description || config.description;
  const displayTitle = error || config.title;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center'>
        {/* Icon */}
        <div className='flex justify-center mb-8'>
          <div className={`p-6 ${config.iconBgColor} rounded-full`}>
            <Icon className={`w-24 h-24 ${config.iconColor}`} />
          </div>
        </div>

        <h1 className='text-5xl md:text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4'>
          {status}
        </h1>

        <h2 className='text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {displayTitle}
        </h2>

        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
          {displayDescription}
        </p>

        {config.showStatusBanner && config.bannerText && (
          <div
            className={`mb-8 p-4 ${config.bannerColor} border-2 rounded-lg max-w-md mx-auto`}
          >
            <p className='text-sm text-amber-800 dark:text-amber-200 font-medium'>
              {config.bannerText}
            </p>
          </div>
        )}

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 active:scale-95'
            >
              <RefreshCw className='w-5 h-5' />
              Try Again
            </button>
          )}
          {!showRefresh && (
            <button
              onClick={() => navigate(-1)}
              className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 active:scale-95'
            >
              <ArrowLeft className='w-5 h-5' />
              Go Back
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
          >
            <Home className='w-5 h-5' />
            Go Home
          </button>
        </div>

        <p className='mt-12 text-sm text-gray-500 dark:text-gray-400'>
          {status >= 500 ? (
            <>
              Error persisting?{' '}
              <a
                href='#'
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                Report this issue
              </a>
            </>
          ) : (
            <>
              Need help?{' '}
              <a
                href='#'
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                Contact Support
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Error;
