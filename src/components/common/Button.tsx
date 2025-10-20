import type { IconType } from 'react-icons';
import { themeColors, type ThemeVariant } from '../../themes/themes';

interface Props {
  title?: string;
  type?: 'button' | 'reset' | 'submit';
  icon?: IconType;
  theme: ThemeVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  title,
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
        active:${colors.active}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        text-sm font-medium
        px-3 py-1.5
        flex items-center justify-center gap-1.5
        rounded-md
        transition-all duration-150 ease-in-out
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      {title}
    </button>
  );
};

export default Button;
