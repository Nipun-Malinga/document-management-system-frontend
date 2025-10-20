import { IoClose } from 'react-icons/io5';
import { Button } from '../../../components';
import { useDocument } from '../../../hooks/useDocument';
import useInfoPopUp from '../../../states/useInfoPopUp';
import BadgeList from './BadgeList';
import Collaborators from './Collaborators';
import ContentView from './ContentView';
import InfoButtons from './InfoButtons';

interface Props {
  documentId: string;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId);
  const { collapsed, toggle } = useInfoPopUp();

  return (
    <div
      className={`fixed z-10 md:top-30 justify-self-center transition duration-100 ease-in-out ${
        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className='relative bg-white w-85 md:min-w-lg lg:min-w-3xl mt-3 md:mt-0 p-4 rounded-2xl shadow-lg flex flex-col gap-4'>
        <div className='absolute right-3 top-3'>
          <Button icon={IoClose} type='button' theme='light' onClick={toggle} />
        </div>

        <div className='space-y-4 mt-7.5'>
          <ContentView />

          {data && <BadgeList document={data} />}

          <p className='text-lg text-gray-900 font-semibold border-b pb-2 border-gray-200'>
            {data?.title || 'Untitled Document'}
          </p>

          <div className='text-sm text-gray-600 space-y-1'>
            <p>
              <span className='font-medium text-gray-700'>Created:</span>{' '}
              <span className='text-gray-500'>{data?.createdAt}</span>
            </p>
            <p>
              <span className='font-medium text-gray-700'>Updated:</span>{' '}
              <span className='text-gray-500'>{data?.updatedAt}</span>
            </p>
          </div>

          <Collaborators documentId={documentId} />
        </div>

        <div className='border-t border-gray-200 pt-3'>
          <InfoButtons documentId={documentId} />
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
