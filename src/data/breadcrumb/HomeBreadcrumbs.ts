import type { Link } from '@/models/Link';

export const mainViewBreadcrumb: Link[] = [
  {
    title: 'Home',
    endpoint: '/home',
  },
];

export const quickAccessBreadcrumb: Link[] = [
  ...mainViewBreadcrumb,
  {
    title: 'Quick Access',
    endpoint: '/quick',
  },
];

export const resentsBreadcrumb: Link[] = [
  ...mainViewBreadcrumb,
  {
    title: 'Quick Access',
    endpoint: '/quick',
  },
];

export const sharedWithMeBreadcrumb: Link[] = [
  ...mainViewBreadcrumb,
  {
    title: 'Shared With Me',
    endpoint: '/shared',
  },
];

export const trashBreadcrumb: Link[] = [
  ...mainViewBreadcrumb,
  {
    title: 'Trash',
    endpoint: '/trash'
  }
]
