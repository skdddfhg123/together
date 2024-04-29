import { Navigate } from 'react-router-dom';
import { Routes } from './types';

import Main from '../../pages/main';
import LogIn from '../../pages/User/logIn';
// import Contact from './routes/contact/contact';

const routes: Routes = [
  {
    path: '/',
    element: <Navigate to="/signin" />,
  },
  {
    path: '/main',
    element: <Main />,
  },
  {
    path: '/signin',
    element: <LogIn />,
  },
];

/*
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: 'contacts/:contactId',
    //     element: <Contact />,
    //   },
    // ],
  },
  {
    path: 'contacts/:contactId',
    element: <Contact />,
  },
]);
*/

const freezedRoutes = Object.freeze(routes);

export { freezedRoutes as routes };
