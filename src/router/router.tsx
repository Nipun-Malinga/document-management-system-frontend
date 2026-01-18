import { SecureRoute } from '@/components';
import {
  DocumentViewLayer,
  MainView,
  Resents,
  Shared,
  Trash,
} from '@/features/documents';
import Quick from '@/features/documents/layouts/Quick';
import { EditorContainer } from '@/features/editor';
import { AdminDashboard, ContentView, Dashboard, Editor, Home } from '@/pages';
import AdminSignin from '@/pages/admin/AdminSignin';
import Error from '@/pages/Error';
import Main from '@/pages/Main';
import Register from '@/pages/Register';
import SignIn from '@/pages/SignIn';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
  Navigate,
} from 'react-router-dom';

function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <Error error={error.data} status={error.status} />;
  }

  return <h1>Unknown Error</h1>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, element: <Home /> },

      { path: 'auth/signin', element: <SignIn /> },
      { path: 'auth/registration', element: <Register /> },

      { path: 'admin/auth/signin', element: <AdminSignin /> },
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
        element: <DocumentViewLayer />,
        children: [
          { path: 'home', element: <MainView /> },
          { path: 'quick', element: <Quick /> },
          { path: 'resents', element: <Resents /> },
          { path: 'shared', element: <Shared /> },
          { path: 'trash', element: <Trash /> },
        ],
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
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: ':documentId/branch/:branchId/view',
        element: <ContentView />,
      },
      {
        path: ':documentId/branch/:branchId/edit',
        element: <EditorContainer />,
      },
    ],
  },
  {
    path: '/admin/dashboard',
    element: (
      <SecureRoute navigation='/admin/auth/signin' type='ADMIN'>
        <Main />
      </SecureRoute>
    ),
    children: [{ index: true, element: <AdminDashboard /> }],
  },
]);

export default router;
