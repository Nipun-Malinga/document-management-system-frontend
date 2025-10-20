import { LuFileText } from 'react-icons/lu';
import { OnlineUserList } from '..';
import { Badge, Button } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';
import { FaCircleInfo } from 'react-icons/fa6';

interface Props {
  documentId: string;
  title: string;
  state: string;
  createdDate: string;
  updatedDate: string;
}

const DocumentCard = ({
  documentId,
  title,
  state,
  createdDate,
  updatedDate,
}: Props) => {
  const { setDocumentId, toggle } = useInfoPopUp();

  return (
    <div className='group w-full min-h-[16rem] p-2.5 border border-gray-200 rounded-lg flex flex-col justify-around transition duration-200 ease-in-out hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <div className='relative bg-blue-50 w-full min-h-[10rem] rounded-md cursor-pointer flex justify-center items-center'>
        <div className='absolute top-2 right-2 flex flex-col items-end transition duration-200 ease-in-out opacity-100 md:opacity-0 md:group-hover:opacity-100'>
          <div className='bg-blue-300 p-1 rounded-md flex flex-col gap-1'>
            <Button
              icon={FaCircleInfo}
              type='button'
              theme='primary'
              onClick={() => {
                toggle();
                setDocumentId(documentId);
              }}
            />
          </div>
        </div>
        <LuFileText className='text-8xl md:text-6xl text-blue-600' />

        <div className='absolute top-2 left-2'>
          <OnlineUserList documentId={documentId} />
        </div>

        <div className='absolute bottom-2 right-2'>
          <Badge
            text={state}
            theme={state.toLowerCase() == 'public' ? 'primary' : 'secondary'}
          />
        </div>
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-base md:text-lg lg:text-sm capitalize font-medium'>
          {title}
        </p>
        <div className='flex justify-between'>
          <p className='text-sm md:text-xs text-gray-500'>
            Created: {createdDate}
          </p>
          <p className='text-sm md:text-xs text-gray-500'>
            Updated: {updatedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
