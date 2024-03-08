import { lazy } from 'react';
import RequireAuth from 'src/components/RequireAuth';
import { RouteConfig } from 'src/routes/routesConfig';

const Logout = lazy(() => import('./Logout'));

export const LogoutRoute: RouteConfig = {
  path: '/logout',
  element: Logout,
  wrapper: RequireAuth,
  auth: true,
};
