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
import { useState } from 'react';
import { flushActiveEditor } from '@/features/editor/persistence/persistenceRegistry';
import { actionError } from '@/features/editor/persistence/actionError';

const UserDropdown = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { toggleProfilePopup } = useUserProfilePopup();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const finishLogout = () => { clearAccessToken(); navigate('/auth/signin'); };
  const logout = async () => {
    if (pending) return;
    setPending(true);
    setError('');
    try { await flushActiveEditor(); finishLogout(); }
    catch (error) { setError(actionError(error)); }
    finally { setPending(false); }
  };

  return (
    <>
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
          disabled={pending}
          onClick={() => { void logout(); }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {pending && <p role='status'>Saving before logout…</p>}
    {error && <div role='alert' className='space-y-2 text-sm text-foreground'>
      <p>{error}</p>
      <Button variant='outline' disabled={pending} onClick={() => { void logout(); }}>Retry save and logout</Button>
      <Button variant='outline' disabled={pending} onClick={() => setError('')}>Stay signed in</Button>
      <Button variant='destructive' disabled={pending} onClick={finishLogout}>Discard local changes and logout</Button>
    </div>}
    </>
  );
};

export default UserDropdown;
