import { FaCircleInfo } from 'react-icons/fa6';
import { Button } from '../../../components';
import useInfoPopUp from '../../../states/useInfoPopUp';

const InfoButton = () => {
  const { toggle } = useInfoPopUp();

  return (
    <div className='bg-blue-300 p-1 rounded-md flex flex-col gap-1'>
      <Button
        icon={FaCircleInfo}
        type='button'
        theme='primary'
        onClick={toggle}
      />
    </div>
  );
};

export default InfoButton;
