import type { SidebarLink } from '@/models/Link';
import { LuClock, LuFiles, LuHouse, LuTrash, LuUsers } from 'react-icons/lu';

export const quicksAsides: SidebarLink[] = [
  {
    icon: LuHouse,
    title: 'Home',
    endpoint: 'home',
    count: 30,
  },
  {
    icon: LuFiles,
    title: 'Quick Access',
    endpoint: 'quick',
    count: 4,
  },
  {
    icon: LuClock,
    title: 'Resents',
    endpoint: 'resents',
    count: 10,
  },
  {
    icon: LuUsers,
    title: 'Shared With Me',
    endpoint: 'shared',
    count: 20,
  },
  {
    icon: LuTrash,
    title: 'Trash',
    endpoint: 'trash',
    count: 0,
  },
];
