import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../../AuthContext';

interface RequireUnauthenticatedProps {
	children: ReactNode;
}

const RequireUnauthenticated: React.FC<RequireUnauthenticatedProps> = ({ children }) => {
	const { isAuth } = useContext(AuthContext);

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return <>{children}</>;
};

export default RequireUnauthenticated;
