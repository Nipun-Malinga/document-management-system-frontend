import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import DocumentGrid from '../features/documents/components/DocumentGrid';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        element: <DocumentGrid />,
      },
    ],
  },
]);

export default router;
