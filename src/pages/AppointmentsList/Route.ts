import { lazy } from 'react';
import { RouteConfig } from 'src/routes/routesConfig';

const AppointmentsList = lazy(() => import('./AppointmentsList'));

export const AppointmentsRoute: RouteConfig = {
  path: '/appointments',
  element: AppointmentsList,
  auth: false,
};
