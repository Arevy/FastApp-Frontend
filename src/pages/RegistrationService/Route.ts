import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/Auth/RequireUnauthenticated';

const RegistrationService = lazy(() => import('./RegistrationService'));

export const RegistrationServiceRoute: RouteConfig = {
  path: '/register-service',
  element: RegistrationService,
  wrapper: RequireUnauthenticated,
  auth: false,
};
