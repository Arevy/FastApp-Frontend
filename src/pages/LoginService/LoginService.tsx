import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationRoute } from 'src/pages/Registration/Route';
import { LoginRoute } from 'src/pages/Login/Route';
import { LoginAdminRoute } from 'src/pages/LoginAdmin/Route';

import LoginForm from 'src/components/Auth/LoginForm';
import { PageTitle } from 'src/components/Top/PageTitle';

const LoginService = () => {
  return (
    <Fragment>
      <div className="my-3 py-3">
        <PageTitle text="Service Log in" />
        <LoginForm userType="SERVICE_USER" />
        <div className="text-center mt-4">
          <Link className="btn btn-outline-primary mr-2" to={LoginRoute.path}>
            Normal User Login
          </Link>
          <Link
            className="btn btn-outline-secondary mr-2"
            to={LoginAdminRoute.path}
          >
            Admin Login
          </Link>
        </div>
        <div className="mt-3 text-center">
          <Link
            className="text-light font-weight-light"
            to={RegistrationRoute.path}
          >
            Don't have an account?{' '}
            <span role="img" aria-label="Winking Face">
              😉
            </span>
          </Link>
        </div>
        <p className="mt-3 text-muted text-center">
          This is a demonstration of different login types for normal users,
          admins, and service providers.
        </p>
      </div>
    </Fragment>
  );
};

export default LoginService;
