import { Route, Routes } from 'react-router-dom';

import { routes } from './routes';
import ErrorPage from '../../pages/error.page';

const Router = () => {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={element}
          errorElement={<ErrorPage />}
        ></Route>
      ))}
    </Routes>
  );
};

export { Router };
