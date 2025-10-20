import { Button } from '../../../components';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { MdOutlineEdit } from 'react-icons/md';
import { useDeleteDocument } from '../../../hooks/useDeleteDocument';
import useInfoPopUp from '../../../states/useInfoPopUp';

interface Props {
  documentId: string;
}

const InfoButtons = ({ documentId }: Props) => {
  const { mutate } = useDeleteDocument(documentId);
  const { toggle } = useInfoPopUp();

  return (
    <div className='w-full flex flex-row gap-1'>
      <Button
        icon={MdOutlineEdit}
        theme='primary'
        title='Edit'
        type='button'
        className='w-full'
        onClick={() => {}}
      />
      <Button
        icon={FaRegShareFromSquare}
        title='Share'
        theme='primary'
        type='button'
        className='w-full'
        onClick={() => {}}
      />
      <Button
        icon={MdDeleteOutline}
        theme='secondary'
        type='button'
        title='Delete'
        className='w-full'
        onClick={() => {
          mutate();
          toggle();
        }}
      />
    </div>
  );
};

export default InfoButtons;
