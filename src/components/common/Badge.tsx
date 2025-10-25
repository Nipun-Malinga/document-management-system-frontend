import type { ThemeVariant } from '../../themes/themes';
import { themeColors } from '../../themes/themes';

interface Props {
  text: String;
  theme: ThemeVariant;
  onClick?: () => void;
}

const Badge = ({ text, theme, onClick }: Props) => {
  return (
    <div
      className={`${themeColors[theme].background} ${themeColors[theme].fontColor}  h-full py-1 px-2 rounded-sm flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.3)]`}
    >
      <p className='text-center text-xs font-bold' onClick={onClick && onClick}>
        {text}
      </p>
    </div>
  );
};

export default Badge;
