import { createBrowserRouter } from 'react-router-dom';
import ContentView from '../pages/ContentView';
import DocumentContainer from '../features/documents/layouts/DocumentContainer';
import { BaseEditor, CollaborativeEditor } from '../features/editor';
import Editor from '../pages/Editor';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        element: <DocumentContainer />,
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
