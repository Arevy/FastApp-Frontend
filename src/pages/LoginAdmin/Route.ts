import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/Auth/RequireUnauthenticated';

const LoginAdmin = lazy(() => import('./LoginAdmin'));

export const LoginAdminRoute: RouteConfig = {
  path: '/login-admin',
  element: LoginAdmin,
  wrapper: RequireUnauthenticated,
  auth: false,
};
