import { Navigate } from 'react-router-dom';
import { Routes } from './types';

import Main from '@pages/main/main';
import LogIn from '@pages/User/logIn';

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

const freezedRoutes = Object.freeze(routes);

export { freezedRoutes as routes };
