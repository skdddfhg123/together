import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import { Loading } from './pages/loading';
// import QueryProvider from './queryProvider';
// import { Router } from './common/routes';

import { routes } from '@routes/index';
import ErrorPage from '@pages/main/errorPage';

import '@styles/global.css';
// import './style/font.css';

const router = createBrowserRouter([
  ...routes.map(({ path, element }) => ({
    path,
    element,
  })),
  { path: '*', element: <ErrorPage /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <QueryProvider> */}
    {/* <Suspense fallback={<Loading />}> */}
    <RouterProvider router={router} />
    {/* </Suspense> */}
    {/* </QueryProvider> */}
  </React.StrictMode>,
);