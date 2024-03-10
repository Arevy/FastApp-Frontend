import { lazy } from 'react';
import { RouteConfig } from '../../routes/routesConfig'; // Asumând că avem un tip exportat RouteConfig
import RequireUnauthenticated from 'src/components/RequireUnauthenticated';

const Login = lazy(() => import('./Login'));

export const LoginRoute: RouteConfig = {
  path: '/login',
  element: Login,
  wrapper: RequireUnauthenticated,
  auth: false,
};
