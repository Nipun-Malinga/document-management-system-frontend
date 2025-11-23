import { FaCircleInfo } from 'react-icons/fa6';
import { LuFileText } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { OnlineUserList } from '..';
import { Button } from '@/components';
import type { Document } from '@/models/Document';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import BadgeList from './BadgeList';
import useDocumentBranch from '@/states/useDocumentBranch';
import { Toggle } from '@/components/ui/toggle';
import { Bookmark } from 'lucide-react';
import { useToggleFavorite } from '@/hooks/document';

interface Props {
  document: Document;
  shared: boolean;
}

const DocumentCard = ({ document, shared }: Props) => {
  const navigate = useNavigate();
  const { setDocumentId, collapsed, toggleDocumentInfoPopup, setShared } =
    useDocumentInfoPopUp();
  const { resetBranchName } = useDocumentBranch();
  const { mutate: toggleFavorite } = useToggleFavorite(document.id);

  return (
    <div
      className={`relative group w- bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md ${
        collapsed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className='relative aspect-4/3 p-4'>
        <div className='absolute z-10 top-2 right-2 flex flex-row items-start gap-2 transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100'>
          <Toggle
            aria-label='Toggle bookmark'
            size='default'
            variant='outline'
            pressed={document.favorite}
            onClick={() => toggleFavorite()}
            className='cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 data-[state=on]:bg-yellow-50 data-[state=on]:border-yellow-400 data-[state=on]:text-yellow-600 dark:data-[state=on]:bg-yellow-900/20 dark:data-[state=on]:border-yellow-500 dark:data-[state=on]:text-yellow-400'
          >
            <Bookmark className='h-4 w-4' />
          </Toggle>
          <Button
            icon={FaCircleInfo}
            type='button'
            className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700'
            onClick={() => {
              toggleDocumentInfoPopup();
              resetBranchName();
              setDocumentId(document.id);
              setShared(shared);
            }}
          />
        </div>

        <div className='absolute z-10 bottom-2 right-2'>
          <BadgeList document={document} />
        </div>

        <div
          onClick={() => {
            navigate(
              `/document/${document.id}/branch/${document.mainBranchId}/edit`
            );
          }}
          className='relative bg-gray-50 dark:bg-gray-900 w-full h-full rounded-md cursor-pointer flex justify-center items-center overflow-hidden transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-850 border border-gray-200 dark:border-gray-700'
        >
          <LuFileText className='text-7xl text-gray-400 dark:text-gray-600 transition-transform duration-200 group-hover:scale-105' />

          <div className='absolute top-2 left-2'>
            <OnlineUserList documentId={document.id} />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1 px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3'>
        <p className='text-sm font-medium text-gray-900 dark:text-gray-100 capitalize line-clamp-1'>
          {document.title}
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          Created {document.createdAt}
        </p>
      </div>
    </div>
  );
};

export default DocumentCard;
