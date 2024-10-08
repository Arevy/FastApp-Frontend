import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStores } from 'src/stores/RootStoreContext';
import { observer } from 'mobx-react-lite';

import { HomeRoute } from 'src/pages/Home/Route';
interface RequireAdminRoleProps {
  children: ReactNode;
}

const RequireAdminRole: React.FC<RequireAdminRoleProps> = observer(
  ({ children }) => {
    const {
      authStore: { userData },
    } = useStores();

    if (!userData.isAdmin) {
      return <Navigate to={HomeRoute.path} />;
    }

    return <>{children}</>;
  }
);

export default RequireAdminRole;
