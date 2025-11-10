import { createBrowserRouter } from 'react-router-dom';
import ContentView from '../pages/ContentView';
import { BaseEditor, CollaborativeEditor } from '../features/editor';
import Editor from '../pages/Editor';
import Home from '../pages/Home';
import {
  DocumentViewLayer,
  MainView,
  Resents,
  Shared,
  Trash,
} from '@/features/documents';
import Quick from '@/features/documents/layouts/Quick';

const router = createBrowserRouter([
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        index: true,
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
