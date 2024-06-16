import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';

const ServiceAdministration = lazy(() => import('./ServiceAdministration'));

export const ServiceAdministrationRoute: RouteConfig = {
  path: '/services',
  element: ServiceAdministration,

  auth: true,
  admin: false,
};
