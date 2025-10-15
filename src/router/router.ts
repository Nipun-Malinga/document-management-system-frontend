import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

let router = createBrowserRouter([
  {
    path: '/',
    index: true,
    Component: Home,
  },
]);

export default router;
