import React, { ReactNode } from 'react';
import { AccountDetailsRoute } from 'src/pages/AccountDetails/Route';
import { AppointmentsRoute } from 'src/pages/AppointmentsAdministration/Route';

import { HomeRoute } from 'src/pages/Home/Route';
import { LoginRoute } from 'src/pages/Login/Route';
import { LoginAdminRoute } from 'src/pages/LoginAdmin/Route';
import { LoginServiceRoute } from 'src/pages/LoginService/Route';
import { LogoutRoute } from 'src/pages/Logout/Route';
import { Page404Route } from 'src/pages/Page404/Route';
import { RegistrationRoute } from 'src/pages/Registration/Route';
import { RegistrationAdminRoute } from 'src/pages/RegistrationAdmin/Route';
import { RegistrationServiceRoute } from 'src/pages/RegistrationService/Route';
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
  AccountDetailsRoute,
  LoginAdminRoute,
  LoginServiceRoute,
  RegistrationRoute,
  RegistrationAdminRoute, 
  RegistrationServiceRoute, 
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
  AccountDetailsRoute,
  LoginAdminRoute,
  LoginServiceRoute,
  LogoutRoute,
  UserAdministrationRoute,
  Page404Route,
  AppointmentsRoute,
  ServiceAdministrationRoute,
};
