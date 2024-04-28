import { ReactNode } from 'react';

type Route = {
  path: string;
  element: ReactNode;
  errorElement: ReactNode;
};

type Routes = Array<Route>;

export type { Route, Routes };
