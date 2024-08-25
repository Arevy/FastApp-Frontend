import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/Auth/RequireUnauthenticated';

const LoginService = lazy(() => import('./LoginService'));

export const LoginServiceRoute: RouteConfig = {
  path: '/login-service',
  element: LoginService,
  wrapper: RequireUnauthenticated,
  auth: false,
};
