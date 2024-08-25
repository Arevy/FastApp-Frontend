import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
// import { RegisterForm } from 'src/components/Auth/RegisterForm';
import RegisterServiceForm from 'src/components/Auth/RegisterServiceForm';
import { PageTitle } from 'src/components/Top/PageTitle';
import { RegistrationRoute } from 'src/pages/Registration/Route';
import { RegistrationAdminRoute } from 'src/pages/RegistrationAdmin/Route';

const RegistrationService = () => {
  return (
    <Fragment>
      <div className="my-3 py-3">
        <PageTitle text="Create a service account" />
        <RegisterServiceForm />
        <div className="text-center mt-4">
          <Link
            className="btn btn-outline-primary mr-2"
            to={RegistrationRoute.path}
          >
            Normal User Registration
          </Link>
          <Link
            className="btn btn-outline-secondary mr-2"
            to={RegistrationAdminRoute.path}
          >
            Admin Registration
          </Link>
        </div>
        <p className="mt-3 text-muted text-center">
          This is a demonstration of different registration types for normal
          users, admins, and service providers.
        </p>
      </div>
    </Fragment>
  );
};

export default RegistrationService;
