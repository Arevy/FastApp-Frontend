import { lazy } from 'react';
import RequireAuth from 'src/components/RequireAuth';
import { RouteConfig } from 'src/routes/routesConfig';
import UserAdministration from 'src/pages/UserAdministration/UserAdministration';
import RequireUnauthenticated from 'src/components/RequireUnauthenticated';

const Registration = lazy(() => import('./Registration'));

export const RegistrationRoute: RouteConfig = {
  path: '/register',
  element: Registration,
  wrapper: RequireUnauthenticated,
  auth: false,
};
