import { FaCircleInfo } from 'react-icons/fa6';
import { LuFileText } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { OnlineUserList } from '..';
import { Button } from '../../../components';
import type { Document } from '../../../models/Document';
import useInfoPopUp from '../../../states/useInfoPopUp';
import BadgeList from './BadgeList';
import { getEditorURI } from '../services';
import useDocumentBranch from '../../../states/useDocumentBranch';

interface Props {
  document: Document;
}

const DocumentCard = ({ document }: Props) => {
  const { setDocumentId, collapsed, toggle } = useInfoPopUp();
  const { resetBranchName } = useDocumentBranch();
  const navigate = useNavigate();

  return (
    <div
      className={`relative group w-full h-72 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col gap-3 transition-all duration-200 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 ${
        collapsed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className='relative flex-1'>
        <div className='absolute z-10 top-1 right-1 flex flex-col items-end transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100'>
          <Button
            icon={FaCircleInfo}
            type='button'
            className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-900'
            onClick={() => {
              toggle();
              setDocumentId(document.id);
              resetBranchName();
            }}
          />
        </div>

        <div className='absolute z-10 bottom-2 right-2'>
          <BadgeList document={document} />
        </div>

        <div
          onClick={() =>
            navigate(
              getEditorURI(document.id, document.mainBranchId, document.shared)
            )
          }
          className='relative bg-blue-50 dark:bg-gray-600  w-full h-full rounded-lg cursor-pointer flex justify-center items-center overflow-hidden transition-all duration-200 hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-gray-850 dark:hover:to-gray-800 ring-1 ring-gray-200 dark:ring-gray-700'
        >
          <LuFileText className='text-7xl text-blue-600 dark:text-blue-500 transition-transform duration-200 group-hover:scale-110' />

          <div className='absolute top-2 left-2'>
            <OnlineUserList documentId={document.id} />
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-1 px-2'>
        <p className='text-base font-semibold text-gray-900 dark:text-gray-100 capitalize line-clamp-1 w-full text-center'>
          {document.title}
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
          Created {document.createdAt}
        </p>
      </div>
    </div>
  );
};

export default DocumentCard;