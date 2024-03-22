import React, { Fragment } from "react";
import { PageTitle } from "src/components/PageTitle";
import { GetListOfUsers } from "src/components/Lists/ListOfUsers/GetListOfUsers";

const UserAdministration = () => {
  return (
    <Fragment>
      <PageTitle text="User administration panel" />
      <GetListOfUsers />
    </Fragment>
  );
};

UserAdministration.displayName = "UserAdministration";

export default UserAdministration;
