import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';

interface SubmitButtonProps {
	children: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children, disabled, onClick }) => {
	return (
		<button disabled={disabled} className="btn btn-outline-info" onClick={onClick}>
			{children}
		</button>
	);
};

SubmitButton.propTypes = {
	children: PropTypes.node.isRequired,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
};
