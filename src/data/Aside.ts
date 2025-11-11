import type { SidebarLink } from '@/models/Link';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa6';
import { LuFiles, LuUsers } from 'react-icons/lu';

export const quicksAsides: SidebarLink[] = [
  {
    icon: LuFiles,
    title: 'Quick Access',
    endpoint: 'quick',
    count: 4,
  },
  {
    icon: FaRegClock,
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
    icon: FaRegTrashAlt,
    title: 'Trash',
    endpoint: 'trash',
    count: 0,
  },
];
