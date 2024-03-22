import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { PageTitle } from '../../components/PageTitle';
import LoginForm from 'src/components/Auth/LoginForm';
import { useStores } from 'src/stores/RootStoreContext';

const Login = () => {
  const {
    authStore: { activateAuth },
  } = useStores();

  return (
    <Fragment>
      <PageTitle text="Log in" />
      <LoginForm activateAuth={activateAuth} />
      <Link className="text-light font-weight-light" to="/register">
        Don't have an account?{' '}
        <span role="img" aria-label="Winking Face">
          😉
        </span>
      </Link>
    </Fragment>
  );
};
export default Login;
