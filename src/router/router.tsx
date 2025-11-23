import { Register, SecureRoute, SignIn } from '@/components';
import {
  DocumentViewLayer,
  MainView,
  Resents,
  Shared,
  Trash,
} from '@/features/documents';
import Quick from '@/features/documents/layouts/Quick';
import { ContentView, Dashboard, Editor, Home } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { EditorContainer } from '../features/editor';

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
    element: (
      <SecureRoute>
        <Dashboard />
      </SecureRoute>
    ),
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
    element: (
      <SecureRoute>
        <Editor />
      </SecureRoute>
    ),
    children: [
      {
        path: ':documentId/branch/:branchId/view',
        element: <ContentView />,
      },
      {
        path: '',
        element: <ContentView />,
      },
      {
        path: ':documentId/branch/:branchId/edit',
        element: <EditorContainer />,
      },
    ],
  },
]);

export default router;
