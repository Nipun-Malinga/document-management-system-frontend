import { createBrowserRouter } from 'react-router-dom';
import { BaseEditor, CollaborativeEditor } from '../features/editor';
import {
  DocumentViewLayer,
  MainView,
  Resents,
  Shared,
  Trash,
} from '@/features/documents';
import Quick from '@/features/documents/layouts/Quick';
import { Home, Editor, Dashboard, ContentView } from '@/pages';
import { Register, SignIn } from '@/components';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        element: '',
      },
      {
        path: 'auth/signin',
        element: <SignIn />,
      },
      {
        path: 'auth/registration',
        element: <Register />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        index: true,
        path: 'home',
        element: <DocumentViewLayer children={<MainView />} />,
      },
      {
        path: 'quick',
        element: <DocumentViewLayer children={<Quick />} />,
      },
      {
        path: 'resents',
        element: <DocumentViewLayer children={<Resents />} />,
      },
      {
        path: 'shared',
        element: <DocumentViewLayer children={<Shared />} />,
      },
      {
        path: 'trash',
        element: <DocumentViewLayer children={<Trash />} />,
      },
    ],
  },
  {
    path: '/document',
    element: <Editor />,
    children: [
      {
        path: ':documentId/branch/:branchId/view',
        element: <ContentView />,
      },
      {
        path: ':documentId/branch/:branchId/edit',
        element: <BaseEditor />,
      },
      {
        path: ':documentId/branch/:branchId/edit/collaborative',
        element: <CollaborativeEditor />,
      },
    ],
  },
]);

export default router;
