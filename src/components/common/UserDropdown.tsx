import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/user';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { clearAccessToken } from '@/utils/authUtils';
import useUserProfilePopup from '@/states/useUserProfilePopup';

const UserDropdown = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { toggleProfilePopup } = useUserProfilePopup();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'}>{user?.username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleProfilePopup}>
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            clearAccessToken();
            navigate('/auth/signin');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
