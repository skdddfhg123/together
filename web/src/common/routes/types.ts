import { ReactNode } from 'react';

type Route = {
  path: string;
  element: ReactNode;
  // isPublic: boolean;
};

type Routes = Array<Route>;

export type { Route, Routes };
