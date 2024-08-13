import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import {
  BsHouse,
  BsPeople,
  BsBoxArrowInRight,
  BsBoxArrowRight,
  BsListCheck,
  BsTools,
} from "react-icons/bs";
import { routes } from "src/routes/routesConfig";

const SIZE = "32px";

export const NavBar = observer(() => {
  const { authStore } = useStores();

  const {
    HomeRoute,
    LoginRoute,
    LogoutRoute,
    UserAdministrationRoute,
    AppointmentsRoute,
    ServiceAdministrationRoute,
  } = routes;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-between d-flex border-bottom border-info mt-2 mb-5">
      <Link
        className="navbar-item text-light font-weight-bold"
        to={HomeRoute.path}
      >
        <BsHouse size={SIZE} title="Home" />
      </Link>
      {/* {authStore.isAuth && authStore.userData.isAdmin && ( */}
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
        to={!authStore.isAuth ? LoginRoute.path : LogoutRoute.path}
      >
        {!authStore.isAuth ? (
          <BsBoxArrowInRight size={SIZE} title="Login" />
        ) : (
          <button type="button" className="btn btn-secondary btn-sm mx-auto">
            Hi, {authStore.userData.userName}{" "}
            <BsBoxArrowRight size={SIZE} title="Logout" />
          </button>
        )}
      </Link>
    </nav>
  );
});
