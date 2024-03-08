import React, { Fragment } from 'react';
import { PageTitle } from '../../components/PageTitle';
import { RegisterForm } from '../../components/RegisterForm';

const Registration = () => {
  return (
    <Fragment>
      <PageTitle text="Create an account" />
      <RegisterForm />
    </Fragment>
  );
};

export default Registration;
