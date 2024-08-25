import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/Auth/RequireUnauthenticated';

const RegistrationAdmin = lazy(() => import('./RegistrationAdmin'));

export const RegistrationAdminRoute: RouteConfig = {
  path: '/register-admin',
  element: RegistrationAdmin,
  wrapper: RequireUnauthenticated,
  auth: false,
};
