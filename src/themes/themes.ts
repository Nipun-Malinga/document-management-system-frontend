interface ThemeColor {
  background: string;
  fontColor: string;
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
  light: {
    background: 'bg-gray-100',
    fontColor: 'text-gray-900',
  },
};
