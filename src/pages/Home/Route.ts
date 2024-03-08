import { lazy } from 'react';
import { RouteConfig } from '../../routes/routesConfig'; // Asumând că avem un tip exportat RouteConfig

const Home = lazy(() => import('./Home'));

export const HomeRoute: RouteConfig = {
  path: '/',
  element: Home,
  auth: false,
};
