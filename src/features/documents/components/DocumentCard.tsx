import { FaCircleInfo } from 'react-icons/fa6';
import { LuFileText } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { OnlineUserList } from '..';
import { Button } from '../../../components';
import type { Document } from '../../../models/Document';
import useBranch from '../../../states/useBranch';
import useInfoPopUp from '../../../states/useInfoPopUp';
import BadgeList from './BadgeList';

interface Props {
  document: Document;
}

const DocumentCard = ({ document }: Props) => {
  const { setDocumentId, collapsed, toggle } = useInfoPopUp();
  const { resetBranchName } = useBranch();
  const navigate = useNavigate();

  return (
    <div
      className={`relative group w-full min-h-64 max-h-72 p-2.5 border border-gray-200 rounded-lg flex flex-col justify-around transition duration-200 ease-in-out hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
        collapsed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className='relative'>
        <div className='absolute z-1 top-2 right-2 flex flex-col items-end transition duration-200 ease-in-out opacity-100 md:opacity-0 md:group-hover:opacity-100'>
          <div className='bg-blue-300 p-1 rounded-md flex flex-col gap-1'>
            <Button
              icon={FaCircleInfo}
              type='button'
              theme='primary'
              onClick={() => {
                toggle();
                setDocumentId(document.id);
                resetBranchName();
              }}
            />
          </div>
        </div>

        <div className='absolute z-1 bottom-2 right-2'>
          <BadgeList document={document} />
        </div>

        <div
          onClick={() =>
            navigate(`/editor/document/${document.id}/branch/main`)
          }
          className='relative bg-blue-50 w-full min-h-40 rounded-md cursor-pointer flex justify-center items-center'
        >
          <LuFileText className='text-6xl md:text-8xl text-blue-600' />

          <div className='absolute top-2 left-2'>
            <OnlineUserList documentId={document.id} />
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center'>
        <p className='text-base md:text-lg lg:text-sm capitalize font-medium'>
          {document.title}
        </p>
        <div className='flex flex-row justify-between'>
          <p className='text-sm md:text-xs text-gray-500'>
            Created: {document.createdAt}
          </p>
          <p className='text-sm md:text-xs text-gray-500'>
            Updated: {document.updatedAt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
