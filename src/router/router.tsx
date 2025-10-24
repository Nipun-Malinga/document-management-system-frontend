import { createBrowserRouter } from 'react-router-dom';
import DocumentContainer from '../features/documents/layouts/DocumentContainer';
import Home from '../pages/Home';
import { BaseEditor } from '../features/editor';
import ContentView from '../features/documents/components/ContentView';

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
    path: '/view/document/:documentId/branch/:branchName',
    element: <ContentView />,
  },
  {
    path: '/edit/document/:documentId/branch/:branchName',
    element: <BaseEditor />,
  },
]);

export default router;
