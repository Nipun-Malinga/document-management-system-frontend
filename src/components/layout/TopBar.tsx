import useAside from '@/states/useAside';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';
import DarkThemeButton from '../common/DarkThemeButton';
import Notification from '../common/Notification';
import UserDropdown from '../common/UserDropdown';
import Button from '../common/Button';

const TopBar = () => {
  const { toggle } = useAside();

  return (
    <div className='w-full flex flex-row justify-end items-center gap-3 md:gap-4'>
      <div className='md:hidden shrink-0'>
        <Button
          type='button'
          icon={IoMenu}
          onClick={toggle}
          className='hover:bg-gray-100 dark:hover:bg-gray-800'
        />
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <Notification />
        <DarkThemeButton />
        <UserDropdown />
        <Button
          type='button'
          icon={HiDotsVertical}
          onClick={() => {}}
          className='hover:bg-gray-100 dark:hover:bg-gray-800'
        />
      </div>
    </div>
  );
};

export default TopBar;
