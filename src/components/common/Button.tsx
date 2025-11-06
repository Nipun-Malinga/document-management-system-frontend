import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { Button as Btn } from '../ui/button';

interface Props {
  title?: string;
  node?: ReactNode;
  type?: 'button' | 'reset' | 'submit';
  icon?: IconType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  title,
  node,
  type = 'button',
  icon: Icon,
  onClick,
  className = '',
  disabled = false,
}: Props) => {
  return (
    <Btn
      variant='ghost'
      className={`p-2.5 cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className='text-sm md:text-lg dark:text-slate-300' />}
      {title}
      {node}
    </Btn>
  );
};

export default Button;
