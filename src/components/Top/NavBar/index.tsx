import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import {
  BsHouse,
  BsPeople,
  BsBoxArrowInRight,
  BsBoxArrowRight,
  BsListCheck,
  BsTools,
  BsInfoCircle,
} from 'react-icons/bs';
import { routes } from 'src/routes/routesConfig';
import './index.scss';
import { AccountDetailsRoute } from 'src/pages/AccountDetails/Route';

const SIZE = '32px';

export const NavBar = observer(() => {
  const { authStore } = useStores();
  const [isSticky, setIsSticky] = useState(false);

  const {
    HomeRoute,
    LoginRoute,
    LogoutRoute,
    UserAdministrationRoute,
    AppointmentsRoute,
    ServiceAdministrationRoute,
  } = routes;

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-dark ${
        isSticky ? 'fixed-top' : 'sticky-top'
      } justify-content-between d-flex border-bottom border-info`}
    >
      <div className="container">
        <Link
          className="navbar-item text-light font-weight-bold"
          to={HomeRoute.path}
        >
          <BsHouse size={SIZE} title="Home" />
        </Link>
        {authStore.isAuth && authStore.userData.userType == 'ADMIN_USER' && (
          <Link
            className="navbar-item text-light font-weight-bold"
            to={UserAdministrationRoute.path}
          >
            <BsPeople size={SIZE} title="User administration" />
          </Link>
        )}
        {authStore.isAuth && (
          <Link
            className="navbar-item text-light font-weight-bold"
            to={AppointmentsRoute.path}
          >
            <BsListCheck size={SIZE} title="Appointments" />
          </Link>
        )}
        {authStore.isAuth && authStore.userData.userType == 'ADMIN_USER' && (
          <Link
            className="navbar-item text-light font-weight-bold"
            to={ServiceAdministrationRoute.path}
          >
            <BsTools size={SIZE} title="Services" />
          </Link>
        )}
        {authStore.isAuth && (
          <Link
            className="navbar-item text-light font-weight-bold"
            to={AccountDetailsRoute.path} // Legăm ruta către `AccountDetails`
          >
            <BsInfoCircle size={SIZE} title="Account Details" />
            {'   '}
            {authStore.userData.userType.toLocaleLowerCase().replace('_', ' ')}
          </Link>
        )}
        <Link
          className="navbar-item text-light font-weight-bold"
          to={!authStore.isAuth ? LoginRoute.path : LogoutRoute.path}
        >
          {!authStore.isAuth ? (
            <BsBoxArrowInRight size={SIZE} title="Login" />
          ) : (
            <button type="button" className="btn btn-secondary btn-sm mx-auto">
              Hi, {authStore.userData.userName}
              {'      '}
              <BsBoxArrowRight size={SIZE} title="Logout" />
            </button>
          )}
        </Link>
      </div>
    </nav>
  );
});
