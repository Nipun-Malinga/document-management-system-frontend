import { IoClose } from 'react-icons/io5';
import { Button } from '../../../components';
import { useDocument } from '../../../hooks/useDocument';
import useInfoPopUp from '../../../states/useInfoPopUp';
import BadgeList from './BadgeList';
import Collaborators from './Collaborators';
import ContentView from './ContentView';
import InfoButtons from './InfoButtons';
import BranchInfo from './BranchInfo';

interface Props {
  documentId: string;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId);
  const { collapsed, toggle } = useInfoPopUp();

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:mt-20 fixed z-15 flex justify-center transition-opacity duration-200 linear ${
        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {data && (
        <div className='relative bg-white w-[95vw] md:w-[650px] lg:w-[850px] p-3 flex flex-col justify-between gap-2.5'>
          <div className='flex flex-row-reverse justify-between'>
            <Button
              icon={IoClose}
              type='button'
              theme='light'
              onClick={toggle}
            />

            <BranchInfo documentId={data.id} />
          </div>

          <div className='flex flex-col gap-2'>
            <ContentView documentId={data.id} />

            <BadgeList document={data} />

            <p className='text-lg font-semibold text-gray-900 border-b pb-2 border-gray-200'>
              {data.title}
            </p>

            <div className='text-sm text-gray-600 space-y-1'>
              <p>
                <span className='font-medium text-gray-700'>Created:</span>{' '}
                <span className='text-gray-500'>{data.createdAt}</span>
              </p>
              <p>
                <span className='font-medium text-gray-700'>Updated:</span>{' '}
                <span className='text-gray-500'>{data.updatedAt}</span>
              </p>
            </div>

            <Collaborators documentId={documentId} />
          </div>

          <div className='border-t border-gray-200 pt-3'>
            <InfoButtons documentId={documentId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPopup;
