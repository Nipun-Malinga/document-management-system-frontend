import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthContainer = ({ children }: Props) => {
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-2'>
      <div className='w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700'>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
