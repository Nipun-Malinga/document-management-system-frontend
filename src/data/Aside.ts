import type { IconType } from 'react-icons';
import { LuFiles } from 'react-icons/lu';
import { FaRegClock } from 'react-icons/fa6';
import { LuUsers } from 'react-icons/lu';
import { FaRegTrashAlt } from 'react-icons/fa';

export interface AsideQuick {
  icon: IconType;
  title: string;
  endpoint: string;
  count: number;
}

export const quicksAsides: AsideQuick[] = [
  {
    icon: LuFiles,
    title: 'Quick Access',
    endpoint: '/quick',
    count: 4,
  },
  {
    icon: FaRegClock,
    title: 'Resents',
    endpoint: '/resents',
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
    endpoint: '/trash',
    count: 0,
  },
];
