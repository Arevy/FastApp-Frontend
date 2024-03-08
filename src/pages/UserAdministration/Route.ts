import { lazy } from 'react';
import RequireAuth from 'src/components/RequireAuth';
import { RouteConfig } from 'src/routes/routesConfig';

const UserAdministration = lazy(() => import('./UserAdministration'));

export const UserAdministrationRoute: RouteConfig = {
  path: '/user-administration',
  element: UserAdministration,
  auth: true,
  admin: true,
};
