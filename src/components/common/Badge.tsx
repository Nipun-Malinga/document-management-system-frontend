import type { ThemeVariant } from '../../themes/themes';
import { themeColors } from '../../themes/themes';
import { Badge as Bdg } from '../ui/badge';

interface Props {
  text: String;
  theme: ThemeVariant;
}

const Badge = ({ text, theme }: Props) => {
  return (
    <Bdg
      className={`${themeColors[theme].background} ${themeColors[theme].fontColor} font-bold w-15 rounded-sm`}
    >
      {text}
    </Bdg>
  );
};

export default Badge;
