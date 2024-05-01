import { Navigate } from 'react-router-dom';
import { Routes } from './types';

import Main from '@pages/main/main';
import LogIn from '@pages/User/logIn';
import Test from '@pages/main/test';
import UserInfo from '@pages/User/userInfo';
import ConnectionPage from '@pages/User/connection';

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
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/userinfo',
    element: <UserInfo />,
  },
  {
    path: '/connection',
    element: <ConnectionPage />,
  },
];

const freezedRoutes = Object.freeze(routes);

export { freezedRoutes as routes };
