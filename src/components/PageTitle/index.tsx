import PropTypes from 'prop-types';
import React from 'react';

interface PageTitleProps {
	text: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ text }) => (
	<h2 className="mb-3 font-weight-light text-light">{text}</h2>
);

PageTitle.propTypes = {
	text: PropTypes.string.isRequired,
};
