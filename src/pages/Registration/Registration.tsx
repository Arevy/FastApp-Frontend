import React, { Fragment } from 'react';
import { RegisterForm } from 'src/components/Auth/RegisterForm';
import { PageTitle } from 'src/components/Top/PageTitle';

const Registration = () => {
  return (
    <Fragment>
      <PageTitle text="Create an account" />
      <RegisterForm />
    </Fragment>
  );
};

export default Registration;
