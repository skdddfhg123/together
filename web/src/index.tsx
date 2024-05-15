import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
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
  <React.StrictMode>
    <ToastContainer
      containerId="calendarAlert"
      className="calendarAlert"
      position="top-center"
      limit={5}
      pauseOnHover={false}
      closeButton={true}
      autoClose={3000}
      theme="colored"
      stacked
      hideProgressBar
    />
    <ToastContainer
      containerId="memberAlert"
      className="memberAlert"
      position="bottom-right"
      limit={5}
      pauseOnHover={false}
      closeButton={true}
      autoClose={5000}
      theme="colored"
      stacked
      hideProgressBar
    />
    {/* <QueryProvider> */}
    {/* <Suspense fallback={<Loading />}> */}
    <RouterProvider router={router} />
    {/* </Suspense> */}
    {/* </QueryProvider> */}
  </React.StrictMode>,
);
