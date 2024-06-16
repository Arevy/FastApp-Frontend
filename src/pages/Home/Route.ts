import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';

const Home = lazy(() => import('./Home'));

export const HomeRoute: RouteConfig = {
  path: '/',
  element: Home,
};
