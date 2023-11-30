import { Fragment } from 'react';

import { PageTitle } from '../components/PageTitle';
import React from 'react';

import { GetListOfUsers } from '../components/GetListOfUsers';

const UserAdministration = () => {
	return (
		<Fragment>
			<PageTitle text='User administration panel' />
			<GetListOfUsers />
		</Fragment>
	);
};

UserAdministration.displayName = 'UserAdministration';

export default UserAdministration;
