import { useUser } from '@/hooks/user';
import useAside from '@/states/useAside';
import { UserStar } from 'lucide-react';
import { IoMenu } from 'react-icons/io5';
import Button from '../common/Button';
import DarkThemeButton from '../common/DarkThemeButton';
import Notification from '../common/Notification';
import UserDropdown from '../common/UserDropdown';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { toggle } = useAside();
  const navigate = useNavigate();
  const user = useUser();

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
        {user?.role === 'ADMIN' && (
          <Button
            type='button'
            icon={UserStar}
            onClick={() => navigate('/admin/dashboard')}
            className='hover:bg-gray-100 dark:hover:bg-gray-800'
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
