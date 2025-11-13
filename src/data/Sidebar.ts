import type { SidebarLink } from '@/models/Link';
import type { SidebarData } from '@/models/SidebarData';
import { LuClock, LuFiles, LuHouse, LuTrash, LuUsers } from 'react-icons/lu';

export const sidebarData = (data: SidebarData): SidebarLink[] => {
  return [
    {
      icon: LuHouse,
      title: 'Home',
      endpoint: 'home',
      count: data.documents,
    },
    {
      icon: LuFiles,
      title: 'Quick Access',
      endpoint: 'quick',
      count: data.quick,
    },
    {
      icon: LuClock,
      title: 'Resents',
      endpoint: 'resents',
      count: data.resents,
    },
    {
      icon: LuUsers,
      title: 'Shared With Me',
      endpoint: 'shared',
      count: data.shared,
    },
    {
      icon: LuTrash,
      title: 'Trash',
      endpoint: 'trash',
      count: data.trash,
    },
  ];
};
