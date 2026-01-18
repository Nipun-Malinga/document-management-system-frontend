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
import { ContentView, Dashboard, Editor, Home } from '@/pages';
import AdminSignin from '@/pages/admin/AdminSignin';
import Error from '@/pages/Error';
import Main from '@/pages/Main';
import Register from '@/pages/Register';
import SignIn from '@/pages/SignIn';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';

function RootErrorBoundary() {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <Error error={error.data} status={error.status} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth/signin',
        element: <SignIn />,
      },
      {
        path: 'auth/registration',
        element: <Register />,
      },
      {
        path: '/admin/auth/signin',
        element: <AdminSignin />,
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
  {
    path: '/admin',
    element: (
      <SecureRoute navigation='/admin/auth/signin' type='ADMIN'>
        <Main />
      </SecureRoute>
    ),
    children: [
      {
        path: 'dashboard',
      },
    ],
  },
]);

export default router;
