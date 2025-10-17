import type { ThemeVariant } from "../../themes/themes";
import { themeColors } from "../../themes/themes";

interface Props {
  text: String;
  theme: ThemeVariant;
}

const Badge = ({ text, theme }: Props) => {
  return (
    <p
      className={`${themeColors[theme].background} ${themeColors[theme].fontColor} text-center text-xs font-bold w-20 px-3 py-1 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.3)]`}
    >
      {text}
    </p>
  );
};

export default Badge;
