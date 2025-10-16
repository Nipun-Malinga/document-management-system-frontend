interface Props {
  text: String;
  theme: 'primary' | 'secondary' | 'common' | 'dark';
}

interface ThemeColor {
  background: string;
  fontColor: string;
}

type ThemeVariant = 'primary' | 'secondary' | 'common' | 'dark';

const themeColors: Record<ThemeVariant, ThemeColor> = {
  primary: {
    background: 'bg-blue-600',
    fontColor: 'text-white',
  },
  secondary: {
    background: 'bg-red-600',
    fontColor: 'text-white',
  },
  common: {
    background: 'bg-white',
    fontColor: 'text-gray-900',
  },
  dark: {
    background: 'bg-gray-900',
    fontColor: 'text-gray-100',
  },
};

const Badge = ({ text, theme }: Props) => {
  return (
    <p
      className={`${themeColors[theme].background} ${themeColors[theme].fontColor} text-center md:text-sm font-bold w-20 px-3 py-1 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.3)]`}
    >
      {text}
    </p>
  );
};

export default Badge;
