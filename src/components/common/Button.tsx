import type { IconType } from 'react-icons';
import { themeColors, type ThemeVariant } from '../../themes/themes';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  node?: ReactNode;
  type?: 'button' | 'reset' | 'submit';
  icon?: IconType;
  theme: ThemeVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  title,
  node,
  type = 'button',
  icon: Icon,
  theme,
  onClick,
  className = '',
  disabled = false,
}: Props) => {
  const colors = themeColors[theme];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colors.background}
        ${colors.fontColor}
        ${colors.hover}
        ${colors.active}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        h-full
        text-xs font-medium
        px-3 py-1.5
        flex items-center justify-center gap-1.5
        rounded-sm
        transition-all duration-100 ease-in-out
        ${className}
      `}
    >
      {Icon && <Icon className='text-xs md:text-lg' />}
      {title}
      {node}
    </button>
  );
};

export default Button;
