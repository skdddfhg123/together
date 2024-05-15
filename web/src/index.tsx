import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import { Loading } from './pages/loading';
// import QueryProvider from './queryProvider';
// import { Router } from './common/routes';

import { routes } from '@routes/index';
import ErrorPage from '@pages/main/error';

import '@styles/global.css';
// import './style/font.css';
Modal.setAppElement('#root');

const router = createBrowserRouter([
  ...routes.map(({ path, element }) => ({
    path,
    element,
  })),
  { path: '*', element: <ErrorPage /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  < RouterProvider router={router} />,

);
