import { IoClose } from 'react-icons/io5';
import { Button } from '@/components';
import useInfoPopUp from '@/states/useInfoPopUp';
import BadgeList from './BadgeList';
import Collaborators from './collaborators/Collaborators';
import InfoButtons from './InfoButtons';
import BranchSwitch from './BranchSwitch';
import { useDocument } from '@/hooks/document';

interface Props {
  documentId?: string | null;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId ?? '');
  const { collapsed, toggle } = useInfoPopUp();

  return (
    <div className='flex justify-center items-start'>
      <div
        className={`fixed z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-[90vw] md:w-[70vw] lg:w-[55vw] xl:w-[45vw] p-6 rounded-2xl shadow-2xl flex flex-col gap-6 transition-all duration-300 ${
          collapsed
            ? 'opacity-0 pointer-events-none scale-95 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {data && documentId && (
          <>
            {/* Header */}
            <div className='flex flex-row justify-between items-start gap-3'>
              <div className='flex flex-row gap-2 flex-wrap items-center'>
                <BranchSwitch documentId={documentId} shared={data.shared} />
                <BadgeList document={data} />
              </div>
              <Button
                icon={IoClose}
                type='button'
                onClick={toggle}
                className='shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              />
            </div>

            {/* Content */}
            <div className='flex flex-col gap-5'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1'>
                  {data.title}
                </h2>
                <div className='h-px bg-linear-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-700 dark:via-gray-600' />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                <div className='flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <span className='font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide'>
                    Created
                  </span>
                  <span className='text-gray-900 dark:text-gray-100 font-medium'>
                    {data.createdAt}
                  </span>
                </div>
                <div className='flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700'>
                  <span className='font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide'>
                    Updated
                  </span>
                  <span className='text-gray-900 dark:text-gray-100 font-medium'>
                    {data.updatedAt}
                  </span>
                </div>
              </div>

              <Collaborators documentId={documentId} />
            </div>

            {/* Footer Actions */}
            <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
              <InfoButtons documentId={documentId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPopup;
