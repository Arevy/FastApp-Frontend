import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationRoute } from 'src/pages/Registration/Route';

import LoginForm from 'src/components/Auth/LoginForm';
import { PageTitle } from 'src/components/Top/PageTitle';

const Login = () => {
  return (
    <Fragment>
      <PageTitle text="Log in" />
      <LoginForm />
      <Link
        className="text-light font-weight-light"
        to={RegistrationRoute.path}
      >
        Don't have an account?{' '}
        <span role="img" aria-label="Winking Face">
          😉
        </span>
      </Link>
    </Fragment>
  );
};
export default Login;
