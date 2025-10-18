interface ThemeColor {
  background: string;
  fontColor: string;
  hover: string;
  active: string;
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
    hover: 'hover:bg-blue-500',
    active: 'bg-blue-700',
  },
  secondary: {
    background: 'bg-red-600',
    fontColor: 'text-white',
    hover: 'hover:bg-red-500',
    active: 'bg-red-700',
  },
  common: {
    background: 'bg-white',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-100',
    active: 'bg-gray-200',
  },
  dark: {
    background: 'bg-gray-900',
    fontColor: 'text-gray-100',
    hover: 'hover:bg-gray-700',
    active: 'bg-gray-800',
  },
  light: {
    background: 'bg-gray-100',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-200',
    active: 'bg-gray-300',
  },
};
