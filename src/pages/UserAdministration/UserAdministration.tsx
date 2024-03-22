import React, { Fragment } from "react";
import { PageTitle } from "src/components/Top/PageTitle";
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
