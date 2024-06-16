import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';

const UserAdministration = lazy(() => import('./UserAdministration'));

export const UserAdministrationRoute: RouteConfig = {
  path: '/user-administration',
  element: UserAdministration,

  auth: true,
  admin: false,
};
