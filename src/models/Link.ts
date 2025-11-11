import type { IconType } from 'react-icons';

export interface Link {
  title: string;
  endpoint: string;
}

export interface SidebarLink extends Link {
  icon: IconType;
  count: number;
}
