import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';
import RequireUnauthenticated from 'src/components/Auth/RequireUnauthenticated';

const Login = lazy(() => import('./Login'));

export const LoginRoute: RouteConfig = {
  path: '/login',
  element: Login,
  wrapper: RequireUnauthenticated,
  auth: false,
};
