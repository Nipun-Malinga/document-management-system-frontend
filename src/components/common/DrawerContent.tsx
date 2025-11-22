import { Clock } from 'lucide-react';
import { DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const DrawerContent = ({ title, description, children }: Props) => {
  return (
    <>
      <DrawerHeader className='border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <Clock className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <DrawerTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
              {title}
            </DrawerTitle>
          </div>
        </div>
        <DrawerDescription className='text-gray-600 dark:text-gray-400'>
          {description}
        </DrawerDescription>
      </DrawerHeader>
      {children}
    </>
  );
};

export default DrawerContent;
