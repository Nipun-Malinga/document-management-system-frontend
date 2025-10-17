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
      className={`${colors.background} ${colors.fontColor} text-xs md:text-lg h-full px-2 py-1 flex items-center justify-center gap-x-2 rounded-sm cursor-pointer transition duration-100 ease-in-out hover:bg-gray-200 active:bg-gray-300`}
    >
      {Icon && <Icon />}
      {title && title}
    </button>
  );
};

export default Button;
