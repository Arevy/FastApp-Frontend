import PropTypes from 'prop-types';
import React from 'react';

interface SubmitButtonHelperProps {
	mustShowHelper: boolean;
}

export const SubmitButtonHelper: React.FC<SubmitButtonHelperProps> = ({ mustShowHelper }) => {
	return mustShowHelper ? <small id="submitHelp" className="form-text text-muted">Form submission is only enabled with valid data</small> : null;
};

SubmitButtonHelper.propTypes = {
	mustShowHelper: PropTypes.bool.isRequired
};
