import { IoClose } from 'react-icons/io5';
import { Button } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';
import BadgeList from './BadgeList';
import Collaborators from './Collaborators';
import InfoButtons from './InfoButtons';
import BranchSwitch from './BranchSwitch';
import { useDocument } from '@/hooks/document';

interface Props {
  documentId?: string | null;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId ?? '');
  const { collapsed, toggle } = useInfoPopUp();

  if (!(data && documentId)) return <></>;

  return (
    <div
      className={`fixed top-20 z-20 md:top-0 flex justify-between mt-4 md:mt-20 backdrop-blur-sm transition-opacity duration-200 ${
        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden='true'
    >
      <div className='relative w-[90vw] md:w-[70vw] lg:w-[60vw] bg-white dark:bg-slate-900 border dark:border-slate-600 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-1'>
        <div className='flex flex-row justify-between items-start gap-2'>
          <div className='flex flex-row gap-1 flex-wrap'>
            <BranchSwitch documentId={documentId} shared={data.shared} />
            <BadgeList document={data} />
          </div>
          <Button icon={IoClose} type='button' onClick={toggle} />
        </div>

        <div className='flex flex-col gap-3'>
          <p className='text-lg font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-600'>
            {data.title}
          </p>

          <div className='text-sm text-slate-600 dark:text-slate-300 space-y-1'>
            <p>
              <span className='font-bold'>Created:</span>{' '}
              <span className='text-slate-500 dark:text-slate-300'>
                {data.createdAt}
              </span>
            </p>
            <p>
              <span className='font-bold'>Updated:</span>{' '}
              <span className='text-slate-500 dark:text-slate-300'>
                {data.updatedAt}
              </span>
            </p>
          </div>
          <Collaborators documentId={documentId} />
        </div>

        <div className='border-t border-slate-200 dark:border-slate-600 pt-3'>
          <InfoButtons documentId={documentId} />
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
