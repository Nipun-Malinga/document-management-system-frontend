import { IoClose } from 'react-icons/io5';
import { Button, PopupWrapper } from '@/components';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import BadgeList from '../BadgeList';
import InfoButtons from './InfoButtons';
import BranchSwitch from '../BranchSwitch';
import { useDocument } from '@/hooks/document';
import InfoTabs from './InfoTabs';

interface Props {
  documentId?: string | null;
}

const InfoPopup = ({ documentId }: Props) => {
  const { data } = useDocument(documentId ?? '');
  const { collapsed, toggleDocumentInfoPopup } = useDocumentInfoPopUp();

  return (
    <PopupWrapper collapsed={collapsed}>
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
              onClick={toggleDocumentInfoPopup}
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
          </div>

          <InfoTabs document={data} />

          {/* Footer Actions */}
          <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
            <InfoButtons documentId={documentId} />
          </div>
        </>
      )}
    </PopupWrapper>
  );
};

export default InfoPopup;
