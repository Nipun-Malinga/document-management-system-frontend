import type { ThemeVariant } from '../../themes/themes';
import { themeColors } from '../../themes/themes';
import { Badge as Bdg } from '../ui/badge';

interface Props {
  text: string;
  theme: ThemeVariant;
  className?: string;
}

const Badge = ({ text, theme, className = '' }: Props) => {
  const colors = themeColors[theme];
  
  return (
    <Bdg
      className={`${colors.background} ${colors.fontColor} font-semibold text-xs px-3 py-1 rounded-md shadow-sm border border-transparent transition-all duration-150 hover:scale-105 ${className}`}
    >
      {text}
    </Bdg>
  );
};

export default Badge;