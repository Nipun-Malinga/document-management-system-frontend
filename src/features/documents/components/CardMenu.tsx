import { Button } from '../../../components';
import { FaCircleInfo } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const CardMenu = () => {
  return (
    <div className='bg-blue-300 p-1 rounded-md flex flex-col gap-1'>
      <Button
        icon={FaCircleInfo}
        type='button'
        theme='primary'
        onClick={() => {}}
      />
      <Button
        icon={MdDelete}
        type='button'
        theme='secondary'
        onClick={() => {}}
      />
    </div>
  );
};

export default CardMenu;
