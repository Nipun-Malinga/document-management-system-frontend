interface ThemeColor {
  background: string;
  fontColor: string;
  hover: string;
  active: string;
}

export type ThemeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'accent'
  | 'common'
  | 'dark'
  | 'light';

export const themeColors: Record<ThemeVariant, ThemeColor> = {
  // Semantic Themes
  primary: {
    background: 'bg-blue-600',
    fontColor: 'text-white',
    hover: 'hover:bg-blue-500',
    active: 'active:bg-blue-700',
  },
  secondary: {
    background: 'bg-red-600',
    fontColor: 'text-white',
    hover: 'hover:bg-red-500',
    active: 'active:bg-red-700',
  },
  success: {
    background: 'bg-green-600',
    fontColor: 'text-white',
    hover: 'hover:bg-green-500',
    active: 'active:bg-green-700',
  },
  warning: {
    background: 'bg-yellow-500',
    fontColor: 'text-black',
    hover: 'hover:bg-yellow-400',
    active: 'active:bg-yellow-600',
  },
  error: {
    background: 'bg-red-700',
    fontColor: 'text-white',
    hover: 'hover:bg-red-600',
    active: 'active:bg-red-800',
  },
  info: {
    background: 'bg-sky-600',
    fontColor: 'text-white',
    hover: 'hover:bg-sky-500',
    active: 'active:bg-sky-700',
  },
  neutral: {
    background: 'bg-gray-200',
    fontColor: 'text-gray-800',
    hover: 'hover:bg-gray-300',
    active: 'active:bg-gray-400',
  },
  accent: {
    background: 'bg-purple-600',
    fontColor: 'text-white',
    hover: 'hover:bg-purple-500',
    active: 'active:bg-purple-700',
  },

  // Base Themes
  common: {
    background: 'bg-white',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-100',
    active: 'active:bg-gray-200',
  },
  dark: {
    background: 'bg-gray-900',
    fontColor: 'text-gray-100',
    hover: 'hover:bg-gray-700',
    active: 'active:bg-gray-800',
  },
  light: {
    background: 'bg-gray-100',
    fontColor: 'text-gray-900',
    hover: 'hover:bg-gray-200',
    active: 'active:bg-gray-300',
  },
};
