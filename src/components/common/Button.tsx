import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { Button as Btn } from '../ui/button';

interface Props {
  title?: string;
  children?: ReactNode;
  type?: 'button' | 'reset' | 'submit';
  icon?: IconType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  title,
  children,
  type = 'button',
  icon: Icon,
  onClick,
  className,
  disabled = false,
}: Props) => {
  return (
    <Btn
      variant='outline'
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && (
        <Icon className='text-base md:text-lg text-gray-700 dark:text-gray-300' />
      )}
      {title && (
        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          {title}
        </span>
      )}
      {children}
    </Btn>
  );
};

export default Button;
