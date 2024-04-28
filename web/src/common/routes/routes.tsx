import { Routes } from './types';

import Main from '../../pages/main';
import ErrorPage from '../../pages/error.page';
// import Contact from './routes/contact/contact';

const routes: Routes = [
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: 'contacts/:contactId',
    //     element: <Contact />,
    //   },
    // ],
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
