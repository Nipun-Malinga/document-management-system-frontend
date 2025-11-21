import { Button } from '@/components';
import useTrashDocument from '@/hooks/document/useTrashDocument';
import useDocumentInfoPopUp from '@/states/useDocumentInfoPopup';
import { MdDeleteOutline } from 'react-icons/md';

interface Props {
  documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
  const { mutate } = useTrashDocument(documentId);
  const { toggleCollapsed } = useDocumentInfoPopUp();

  return (
    <div className='w-full flex justify-end gap-1'>
      <Button
        icon={MdDeleteOutline}
        type='button'
        title='Delete'
        onClick={() => {
          mutate();
          toggleCollapsed();
        }}
      />
    </div>
  );
};

export default InfoButtons;
