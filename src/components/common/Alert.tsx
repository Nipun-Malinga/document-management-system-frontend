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
  className?: string;
}

const Alert = ({
  trigger,
  title,
  description,
  action,
  onClick,
  className,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>{trigger}</AlertDialogTrigger>
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
