import { Button } from '../../../components';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { MdOutlineEdit } from 'react-icons/md';
import useInfoPopUp from '../../../states/useInfoPopUp';
import { useDeleteDocument } from '@/hooks/document';

interface Props {
  documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
  const { mutate } = useDeleteDocument(documentId);
  const { toggle } = useInfoPopUp();

  return (
    <div className='w-full flex justify-end gap-1'>
      <Button
        icon={MdOutlineEdit}
        title='Edit'
        type='button'
        onClick={() => {}}
      />
      <Button
        icon={FaRegShareFromSquare}
        title='Share'
        type='button'
        onClick={() => {}}
      />
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
