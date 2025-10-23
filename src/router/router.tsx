import { createBrowserRouter } from 'react-router-dom';
import DocumentContainer from '../features/documents/layouts/DocumentContainer';
import Home from '../pages/Home';
import { BaseEditor } from '../features/editor';

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
    path: '/edit/document/:documentId/branch/:branchName',
    element: <BaseEditor />,
  },
]);

export default router;
