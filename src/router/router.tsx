import {
  DocumentViewLayer,
  MainView,
  Resents,
  Shared,
  Trash,
} from '@/features/documents';
import Quick from '@/features/documents/layouts/Quick';
import { ContentView, Dashboard, Editor, Home } from '@/pages';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';
import { EditorContainer } from '@/features/editor';
import Main from '@/pages/Main';
import Error from '@/pages/Error';
import SignIn from '@/pages/SignIn';
import Register from '@/pages/Register';
import { SecureRoute } from '@/components';

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
