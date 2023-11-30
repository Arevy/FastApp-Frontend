import React from 'react';
import PropTypes from 'prop-types';

interface ErrorAlertProps {
	errorMessage: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage }) => (
	<p className="alert alert-danger py-3 text-center my-5" role="alert">
		{errorMessage}
	</p>
);

ErrorAlert.propTypes = {
	errorMessage: PropTypes.string.isRequired,
};
