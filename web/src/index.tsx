import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './common/utils/authConfig';

// import { Loading } from './pages/loading';

import { routes } from '@routes/index';
import ErrorPage from '@pages/Main/error';

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

const google_id = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
const outlookInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={google_id}>
      <MsalProvider instance={outlookInstance}>
        <ToastContainer
          containerId="calendarAlert"
          className="calendarAlert"
          position="top-center"
          limit={5}
          pauseOnHover={false}
          closeButton={true}
          autoClose={2000}
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
          autoClose={3000}
          theme="colored"
          stacked
          hideProgressBar
        />
        {/* <Suspense fallback={<Loading />}> */}
        <RouterProvider router={router} />
        {/* </Suspense> */}
      </MsalProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
