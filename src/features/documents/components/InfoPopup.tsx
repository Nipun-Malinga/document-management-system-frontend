import { Button } from '../../../components';
import { IoClose } from 'react-icons/io5';
import useInfoPopUp from '../../../states/useInfoPopUp';

const InfoPopup = () => {
  const { toggle } = useInfoPopUp();

  return (
    <div className='relative bg-white w-85 md:min-w-lg lg:min-w-3xl h-130 mt-3 md:mt-0 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.3)]'>
      <div className='absolute right-2 top-2'>
        <Button icon={IoClose} type='button' theme='light' onClick={toggle} />
      </div>
    </div>
  );
};

export default InfoPopup;
