import { Link } from 'react-router-dom';
import {
  BsHouse,
  BsPeople,
  BsBoxArrowInRight,
  BsBoxArrowRight,
} from 'react-icons/bs';
import React from 'react';
import { useStores } from 'src/stores/RootStoreContext';

const SIZE = '32px';

export const NavBar = () => {
  const {
    authStore: { isAuth, userData },
  } = useStores();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark justify-content-between d-flex border-bottom border-info mt-2 mb-5">
      <Link className="navbar-item text-light font-weight-bold" to="/">
        <BsHouse size={SIZE} title="Home" />
      </Link>
      {isAuth && userData.isAdmin && (
        <Link
          className="navbar-item text-light font-weight-bold"
          to="/user-administration"
        >
          <BsPeople size={SIZE} title="User administration" />
        </Link>
      )}
      <Link className="navbar-item text-light font-weight-bold" to="/logout">
        {!isAuth && <BsBoxArrowInRight size={SIZE} title="Login" />}
        {isAuth && <BsBoxArrowRight size={SIZE} title="Logout" />}
      </Link>
    </nav>
  );
};
