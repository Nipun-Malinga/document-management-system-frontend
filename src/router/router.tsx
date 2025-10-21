import { createBrowserRouter } from 'react-router-dom';
import DocumentContainer from '../features/documents/layouts/DocumentContainer';
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
]);

export default router;
