// Remove this import
// import { Fragment } from 'react';
import React from 'react';

import { ErrorAlert } from '../components/ErrorAlert';

export const Page404 = () => {
	return (
		// You can directly return the ErrorAlert without using Fragment
		<ErrorAlert errorMessage='404' />
	);
};
