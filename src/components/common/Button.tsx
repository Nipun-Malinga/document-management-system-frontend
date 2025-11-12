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
      className={`p-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-150 rounded-lg ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className='text-base md:text-lg text-gray-700 dark:text-gray-300' />}
      {title && <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{title}</span>}
      {node}
    </Btn>
  );
};

export default Button;