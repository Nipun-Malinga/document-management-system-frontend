import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import type { ReactNode } from 'react';

interface Props {
  trigger: ReactNode | string;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

const Alert = ({ trigger, title, description, action, onClick }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-sm cursor-pointer'>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClick} className='cursor-pointer'>
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
