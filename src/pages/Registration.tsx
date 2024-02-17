import { Fragment } from 'react';
import { PageTitle } from '../components/PageTitle';
import { RegisterForm } from '../components/RegisterForm';
import React from 'react';

export const Registration = () => {
  return (
    <Fragment>
      <PageTitle text="Create an account" />
      <RegisterForm />
    </Fragment>
  );
};
