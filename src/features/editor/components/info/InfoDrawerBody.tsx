import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FolderOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import BranchCreator from './branches/BranchCreator';

interface Props {
  emptyTitle: string;
  emptyDescription: string;
  buttonTitle: string;
  children?: ReactNode;
}

const InfoDrawerContent = ({
  emptyTitle,
  emptyDescription,
  buttonTitle,
  children,
}: Props) => {
  return (
    <div className='flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
      {children ? (
        <>
          <div className='max-h-[65vh] md:max-h-[70vh] overflow-y-auto'>
            {children}
          </div>
          <BranchCreator title={buttonTitle} />
        </>
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
