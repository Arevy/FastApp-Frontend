import React, { Fragment } from 'react';
import ListOfAppointments from 'src/components/Lists/ListOfAppointments/ListOfAppointments';
import { PageTitle } from 'src/components/Top/PageTitle';

const AppointmentsComponent = () => {
  return (
    <Fragment>
      <PageTitle text="Appointments" createBtn createType="appointment" />
      <ListOfAppointments />
    </Fragment>
  );
};

AppointmentsComponent.displayName = 'AppointmentsComponent';

export default AppointmentsComponent;
