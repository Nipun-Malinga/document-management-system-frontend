import useTrashDocument from '@/hooks/document/useTrashDocument';
import { MdDeleteOutline } from 'react-icons/md';
import { Button } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';

interface Props {
  documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
  const { mutate } = useTrashDocument(documentId);
  const { toggle } = useInfoPopUp();

  return (
    <div className='w-full flex justify-end gap-1'>
      <Button
        icon={MdDeleteOutline}
        type='button'
        title='Delete'
        onClick={() => {
          mutate();
          toggle();
        }}
      />
    </div>
  );
};

export default InfoButtons;
