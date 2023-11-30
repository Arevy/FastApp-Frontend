import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../../AuthContext';

interface RequireAdminRoleProps {
	children: ReactNode;
}

const RequireAdminRole: React.FC<RequireAdminRoleProps> = ({ children }) => {
	const { userData } = useContext(AuthContext);

	if (!userData.isAdmin) {
		return <Navigate to="/" />;
	}

	return <>{children}</>;
};

export default RequireAdminRole;
