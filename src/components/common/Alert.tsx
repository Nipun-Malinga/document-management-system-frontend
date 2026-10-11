import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../ui/alert-dialog';
import { isValidElement, useRef, useState, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { actionError } from '@/features/editor/persistence/actionError';

interface Props {
  trigger: ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void | Promise<unknown>;
  className?: string;
}

const Alert = ({ trigger, title, description, action, onClick, className }: Props) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);
  const confirm = async () => {
    if (running.current) return;
    running.current = true; setPending(true); setError('');
    try { await onClick(); setOpen(false); }
    catch (error) { setError(actionError(error)); }
    finally { running.current = false; setPending(false); }
  };
  return <AlertDialog open={open} onOpenChange={(next) => { if (!running.current) { setOpen(next); setError(''); } }}>
    <AlertDialogTrigger asChild className={className}>{isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      {error && <p role='alert' className='text-sm text-destructive'>{error}</p>}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
        <Button disabled={pending} onClick={() => { void confirm(); }}>{pending ? 'Working…' : action}</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};
export default Alert;
