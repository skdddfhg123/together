import { Navigate } from 'react-router-dom';
import { Routes } from './types';

import Main from '@pages/main/main';
import LogIn from '@pages/User/logIn';
import Test from '@pages/main/test';
import UserInfo from '@pages/User/userInfo';
import ConnectionPage from '@pages/User/connection';
import CreateGroupPage from '@pages/Calendar/createGroup';
import InvitePage from '@pages/User/invite';

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
  {
    path: '/createGroup',
    element: <CreateGroupPage />,
  },
  {
    path: '/invite',
    element: <InvitePage />,
  },
];

const freezedRoutes = Object.freeze(routes);

export { freezedRoutes as routes };
