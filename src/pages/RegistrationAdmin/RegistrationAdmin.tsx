import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from 'src/components/Auth/RegisterForm';
import { PageTitle } from 'src/components/Top/PageTitle';
import { RegistrationRoute } from 'src/pages/Registration/Route';
import { RegistrationServiceRoute } from 'src/pages/RegistrationService/Route';

const RegistrationAdmin = () => {
  return (
    <Fragment>
      <div className="my-3 py-3">
        <PageTitle text="Create an admin account" />
        <RegisterForm userType="ADMIN_USER" />
        <div className="text-center mt-4">
          <Link
            className="btn btn-outline-primary mr-2"
            to={RegistrationRoute.path}
          >
            Normal User Registration
          </Link>
          <Link
            className="btn btn-outline-secondary mr-2"
            to={RegistrationServiceRoute.path}
          >
            Service Registration
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

export default RegistrationAdmin;
