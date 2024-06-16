import React, { ReactNode } from 'react';
import { AppointmentsRoute } from 'src/pages/AppointmentsAdministration/Route';

import { HomeRoute } from 'src/pages/Home/Route';
import { LoginRoute } from 'src/pages/Login/Route';
import { LogoutRoute } from 'src/pages/Logout/Route';
import { Page404Route } from 'src/pages/Page404/Route';
import { RegistrationRoute } from 'src/pages/Registration/Route';
import { ServiceAdministrationRoute } from 'src/pages/ServiceAdministration/Route';
import { UserAdministrationRoute } from 'src/pages/UserAdministration/Route';

interface WrapperProps {
  children: ReactNode;
}

export interface RouteConfig {
  path: string;
  element: React.ElementType;
  wrapper?: React.ComponentType<WrapperProps>; // Ajustăm acest tip
  auth?: boolean;
  admin?: boolean;
}

// Configurarea rutelor
export const routesArray: RouteConfig[] = [
  HomeRoute,
  LoginRoute,
  RegistrationRoute,
  LogoutRoute,
  UserAdministrationRoute,
  Page404Route,
  AppointmentsRoute,
  ServiceAdministrationRoute,
];

// destructure object with routes for an easy import
export const routes = {
  HomeRoute,
  LoginRoute,
  RegistrationRoute,
  LogoutRoute,
  UserAdministrationRoute,
  Page404Route,
  AppointmentsRoute,
  ServiceAdministrationRoute,
};
