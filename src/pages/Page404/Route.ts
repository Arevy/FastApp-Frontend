import { lazy } from 'react';
import RequireAuth from 'src/components/Auth/RequireAuth';
import { RouteConfig } from 'src/routes/routesConfig';

const Page404 = lazy(() => import('./Page404'));

export const Page404Route: RouteConfig = {
  path: '*',
  element: Page404,
  auth: false,
};
