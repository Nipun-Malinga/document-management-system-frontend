import { Button, PopupWrapper } from '@/components';
import useUserProfilePopup from '@/states/useUserProfilePopup';
import { IoClose } from 'react-icons/io5';

const ProfilePopup = () => {
  const { collapsed, toggleProfilePopup } = useUserProfilePopup();

  return (
    <PopupWrapper collapsed={collapsed}>
      <div className='flex flex-row justify-end items-start gap-3'>
        <Button icon={IoClose} onClick={toggleProfilePopup}/>
      </div>

      <div className=''></div>
    </PopupWrapper>
  );
};

export default ProfilePopup;
