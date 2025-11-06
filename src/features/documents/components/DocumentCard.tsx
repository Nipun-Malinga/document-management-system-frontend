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
      className={`relative group w-full min-h-64 max-h-72 p-2.5 border border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col justify-around transition duration-200 ease-in-out hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
        collapsed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className='relative'>
        <div className='absolute z-1 top-0 right-0 flex flex-col items-end transition duration-200 ease-in-out opacity-100 md:opacity-0 md:group-hover:opacity-100'>
          <Button
            icon={FaCircleInfo}
            type='button'
            onClick={() => {
              toggle();
              setDocumentId(document.id);
              resetBranchName();
            }}
          />
        </div>

        <div className='absolute z-1 bottom-2 right-2'>
          <BadgeList document={document} />
        </div>

        <div
          onClick={() =>
            navigate(
              getEditorURI(document.id, document.mainBranchId, document.shared)
            )
          }
          className='relative bg-blue-50 dark:bg-slate-800 w-full min-h-40 rounded-md cursor-pointer flex justify-center items-center'
        >
          <LuFileText className='text-6xl md:text-7xl text-blue-600' />

          <div className='absolute top-2 left-2'>
            <OnlineUserList documentId={document.id} />
          </div>
        </div>
      </div>

      <div className='flex justify-center'>
        <div className='flex flex-col justify-between items-center'>
          <p className='text-base md:text-lg lg:text-sm capitalize font-medium'>
            {document.title}
          </p>
          <p className='text-xs text-slate-500'>Created: {document.createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
