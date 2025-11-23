import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FolderOpen } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  emptyTitle: string;
  emptyDescription: string;
  children?: ReactNode;
}

const InfoDrawerContent = ({
  emptyTitle,
  emptyDescription,
  children,
}: Props) => {
  return (
    <div className='flex-1 overflow-y-auto px-2.5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
      {children ? (
        <div
          className='max-h-[65vh] md:max-h-[70vh] overflow-y-auto px-2 space-y-2 [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-100
                     [&::-webkit-scrollbar-thumb]:bg-gray-300
                     dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                     dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'
        >
          {children}
        </div>
      ) : (
        <Empty className='mt-5 md:mt-10 lg:mt-20'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};

export default InfoDrawerContent;
