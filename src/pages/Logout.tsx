import { useContext, useEffect, Fragment } from 'react';

import { SubmitButton } from '../components/SubmitButton';
import { PageTitle } from '../components/PageTitle';
// import { AuthContext } from '@/AuthContext'; // Assuming correct path
import React from 'react';
import { AuthContext } from 'src/AuthContext';

export const Logout = () => {
	const { removeAuth } = useContext(AuthContext);

	useEffect(() => {
		/* Closing the session after the render of the view */
		removeAuth();
	}, [removeAuth]);

	return (
		<Fragment>
			<PageTitle text="Log out" />
			<div className="mt-5">
				<SubmitButton onClick={removeAuth}>Close session</SubmitButton>
			</div>
		</Fragment>
	);
};
