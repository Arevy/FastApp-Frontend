import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';

const AccountDetails = lazy(() => import('./AccountDetails'));

export const AccountDetailsRoute: RouteConfig = {
  path: '/account-details',
  element: AccountDetails,
  auth: true,
  admin: false,
};
