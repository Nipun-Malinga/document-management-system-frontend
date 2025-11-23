import { History } from 'lucide-react';
import type { ReactNode } from 'react';
import { DrawerContent, DrawerTrigger, Drawer as Drw } from '../ui/drawer';
import { Button } from './Buttons';

interface Props {
  title: string;
  children: ReactNode;
}

const Drawer = ({ title, children }: Props) => {
  return (
    <Drw direction='right'>
      <DrawerTrigger asChild>
        <Button>
          <History className='w-4 h-4' />
          {title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-full sm:w-[500px] rounded-none border-l-2'>
        <div className='bg-white dark:bg-gray-900 h-full flex flex-col'>
          {children}
        </div>
      </DrawerContent>
    </Drw>
  );
};

export default Drawer;
