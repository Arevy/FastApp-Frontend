import { useEffect, Fragment } from 'react';

import { SubmitButton } from '../components/SubmitButton';
import { PageTitle } from '../components/PageTitle';
import React from 'react';
import { useStores } from 'src/stores/RootStoreContext';

export const Logout = () => {
	const { authStore: { removeAuth } } = useStores();

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