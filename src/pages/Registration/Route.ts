import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/RequireUnauthenticated';

const Registration = lazy(() => import('./Registration'));

export const RegistrationRoute: RouteConfig = {
  path: '/register',
  element: Registration,
  wrapper: RequireUnauthenticated,
  auth: false,
};
