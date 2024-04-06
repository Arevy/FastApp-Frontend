import React, { Fragment } from "react";
import { observer } from "mobx-react";
import ListOfAppointments from "src/components/Lists/ListOfAppointments/ListOfAppointments";
import { PageTitle } from "src/components/Top/PageTitle";

const AppointmentsComponent = () => {
  return (
    <Fragment>
      <PageTitle text="Appoiments administration panel" />
      <ListOfAppointments />
    </Fragment>
  );
};

AppointmentsComponent.displayName = "AppointmentsComponent";

export default AppointmentsComponent;
