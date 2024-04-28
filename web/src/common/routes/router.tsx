import { Route, Routes } from 'react-router-dom';

import { routes } from './routes';

const Router = () => {
  return (
    <Routes>
      {routes.map(({ path, element, errorElement }) => (
        <Route
          key={path}
          path={path}
          element={element}
          errorElement={errorElement}
        ></Route>
      ))}
    </Routes>
  );
};

export { Router };
