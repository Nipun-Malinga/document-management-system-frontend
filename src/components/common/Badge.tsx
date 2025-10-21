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
      className={`${themeColors[theme].background} ${themeColors[theme].fontColor} w-[5rem] h-full py-1 rounded-md flex justify-center items-center`}
    >
      <p
        className='text-center text-xs font-bold shadow-[0_3px_10px_rgb(0,0,0,0.3)]'
        onClick={onClick && onClick}
      >
        {text}
      </p>
    </div>
  );
};

export default Badge;
