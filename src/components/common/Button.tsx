import type { IconType } from 'react-icons';
import { themeColors, type ThemeVariant } from '../../themes/themes';

interface props {
  title?: string;
  type: 'button' | 'reset' | 'submit';
  icon?: IconType;
  theme: ThemeVariant;
  onClick: () => void;
}

const Button = ({ title, type, icon: Icon, theme, onClick }: props) => {
  const colors = themeColors[theme];

  return (
    <button
      type={type}
      onClick={() => onClick()}
      className={`${colors.background} ${colors.fontColor} text-sm md:text-base h-full px-2 py-1 flex items-center justify-center gap-x-2 rounded-sm cursor-pointer transition duration-100 ease-in-out ${colors.hover} active:${colors.active}`}
    >
      {Icon && <Icon />}
      {title && title}
    </button>
  );
};

export default Button;
