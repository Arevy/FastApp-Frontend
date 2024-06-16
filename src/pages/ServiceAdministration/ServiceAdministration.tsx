// src/pages/ServiceAdministration/ServiceAdministration.tsx
import React, { Fragment } from 'react';
import ListOfServices from 'src/components/Lists/ListOfServices/ListOfServices';
import { PageTitle } from 'src/components/Top/PageTitle';

const ServiceAdministrationComponent = () => {
  return (
    <Fragment>
      <PageTitle text="Services" createBtn createType="service" />
      <ListOfServices />
    </Fragment>
  );
};

export default ServiceAdministrationComponent;
