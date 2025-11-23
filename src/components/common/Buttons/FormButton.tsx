import { LoaderCircle } from 'lucide-react';
import Button from './Button';

interface Props {
  isValid?: boolean;
  isPending: boolean;
  disabled?: boolean;
  title: string;
  pendingTitle: string;
  onClick?: () => void;
}

const FormButton = ({
  isValid,
  isPending,
  disabled = false,
  title,
  pendingTitle,
  onClick,
}: Props) => {
  return (
    <Button
      type='submit'
      disabled={!isValid || isPending || disabled}
      onClick={onClick}
    >
      {isPending ? (
        <div className='flex items-center justify-center gap-2'>
          <LoaderCircle className='w-5 h-5 animate-spin' />
          <span>{pendingTitle}...</span>
        </div>
      ) : (
        title
      )}
    </Button>
  );
};

export default FormButton;
