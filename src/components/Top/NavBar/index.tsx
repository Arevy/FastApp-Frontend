import React from "react";
import { Link } from "react-router-dom";
import {
  BsHouse,
  BsPeople,
  BsBoxArrowInRight,
  BsBoxArrowRight,
  BsListCheck,
  BsTools,
} from "react-icons/bs";
import { useStores } from "src/stores/RootStoreContext";
import { UserAdministrationRoute } from "src/pages/UserAdministration/Route";
import { HomeRoute } from "src/pages/Home/Route";
import { AppointmentsRoute } from "src/pages/AppointmentsAdministration/Route";
import { LogoutRoute } from "src/pages/Logout/Route";
import { LoginRoute } from "src/pages/Login/Route";
import { ServiceAdministrationRoute } from "src/pages/ServiceAdministration/Route";

const SIZE = "32px";

export const NavBar = () => {
  const {
    authStore: { isAuth, userData },
  } = useStores();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-between d-flex border-bottom border-info mt-2 mb-5">
      <Link
        className="navbar-item text-light font-weight-bold"
        to={HomeRoute.path}
      >
        <BsHouse size={SIZE} title="Home" />
      </Link>
      {/* {isAuth && userData.isAdmin && ( */}
      <Link
        className="navbar-item text-light font-weight-bold"
        to={UserAdministrationRoute.path}
      >
        <BsPeople size={SIZE} title="User administration" />
      </Link>
      {/* )} */}
      <Link
        className="navbar-item text-light font-weight-bold"
        to={AppointmentsRoute.path}
      >
        <BsListCheck size={SIZE} title="Appointments" />
      </Link>
      <Link
        className="navbar-item text-light font-weight-bold"
        to={ServiceAdministrationRoute.path}
      >
        <BsTools size={SIZE} title="Services" />
      </Link>
      <Link
        className="navbar-item text-light font-weight-bold"
        to={!isAuth ? LoginRoute.path : LogoutRoute.path}
      >
        {!isAuth ? (
          <BsBoxArrowInRight size={SIZE} title="Login" />
        ) : (
          <BsBoxArrowRight size={SIZE} title="Logout" />
        )}
      </Link>
    </nav>
  );
};