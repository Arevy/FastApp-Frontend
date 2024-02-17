import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { PageTitle } from '../components/PageTitle';
// import LoginForm from '@/components/LoginForm';
import React from 'react';
import LoginForm from 'src/components/LoginForm';
import { useStores } from 'src/stores/RootStoreContext';

export const Login = () => {

	const { authStore: { activateAuth } } = useStores();

	return (
		<Fragment>
			<PageTitle text='Log in' />
			<LoginForm activateAuth={activateAuth} />
			<Link className="text-light font-weight-light" to='/register'>
				Don't have an account? <span role="img" aria-label="Winking Face">😉</span>
			</Link>
		</Fragment>
	);
};