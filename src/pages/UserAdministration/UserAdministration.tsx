import React, { Fragment } from 'react';
import { PageTitle } from 'src/components/Top/PageTitle';
import { GetListOfUsers } from 'src/components/Lists/ListOfUsers/GetListOfUsers';

const UserAdministration = () => {
  return (
    <Fragment>
      <PageTitle text="User Administration" createBtn createType="user" />
      <GetListOfUsers />
    </Fragment>
  );
};

UserAdministration.displayName = 'UserAdministration';

export default UserAdministration;
