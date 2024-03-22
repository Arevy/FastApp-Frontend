import React, { Fragment } from "react";
import { observer } from "mobx-react";
import ListOfAppointments from "src/components/Lists/ListOfAppointments/ListOfAppointments";
import { PageTitle } from "src/components/PageTitle";
const AppointmentsComponent = observer(() => {
  return (
    <Fragment>
      <PageTitle text="Appoiments administration panel" />
      <ListOfAppointments />
    </Fragment>
  );
});

export default AppointmentsComponent;
