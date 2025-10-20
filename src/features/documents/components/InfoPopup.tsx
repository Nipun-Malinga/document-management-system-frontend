import { IoClose } from 'react-icons/io5';
import { Badge, Button } from '../../../components';
import { useDocument } from '../../../hooks/useDocument';
import useInfoPopUp from '../../../states/useInfoPopUp';
import Collaborators from './Collaborators';
import ContentView from './ContentView';

interface Props {
  documentId: string;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId);
  const { toggle } = useInfoPopUp();

  return (
    <div className='relative bg-white w-85 md:min-w-lg lg:min-w-3xl max-h-max mt-3 md:mt-0 p-2.5 overflow-hidden rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.3)]'>
      <div className='absolute right-2.5'>
        <Button icon={IoClose} type='button' theme='light' onClick={toggle} />
      </div>
      <ContentView />

      <div className='py-2 overflow-y-auto flex flex-col gap-2'>
        <div className='flex flex-row justify-end gap-1'>
          <Badge
            text={data?.status ?? 'UNKNOWN'}
            theme={data?.status == 'PRIVATE' ? 'secondary' : 'primary'}
          />
        </div>
        <p className='text-base text-gray-800 font-medium border-b-2 pb-1 border-gray-300'>
          {data?.title}
        </p>

        <div className='text-gray-500'>
          <p className='text-sm'>
            Created: &nbsp;
            <span className='text-gray-900'>{data?.createdAt}</span>
          </p>
          <p className='text-sm'>
            Updated: &nbsp;
            <span className='text-gray-900'>{data?.updatedAt}</span>
          </p>
        </div>

        <Collaborators documentId={documentId} />
      </div>
    </div>
  );
};

export default InfoPopup;
