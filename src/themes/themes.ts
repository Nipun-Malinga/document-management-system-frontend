interface ThemeColor {
  background: string;
  fontColor: string;
  hover: string;
}

export type ThemeVariant =
  | 'primary'
  | 'secondary'
  | 'common'
  | 'dark'
  | 'light';

export const themeColors: Record<ThemeVariant, ThemeColor> = {
  primary: {
    background: 'bg-blue-600',
    fontColor: 'text-white',
    hover: 'hover:bg-blue-300',
  },
  secondary: {
    background: 'bg-red-600',
    fontColor: 'text-white',
    hover: 'hover:bg-red-300',
  },
  common: {
    background: 'bg-white',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-300',
  },
  dark: {
    background: 'bg-gray-900',
    fontColor: 'text-gray-100',
    hover: 'hover:bg-gray-600',
  },
  light: {
    background: 'bg-gray-100',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-400',
  },
};
