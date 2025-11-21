import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

//TODO: IMPLEMENT NOTIFICATIONS INDICATOR

const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'}>
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='center'
        className='flex flex-col items-center'
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuGroup className='w-full'>
          <DropdownMenuSeparator />
          <DropdownMenuItem></DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
