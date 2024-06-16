import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useStores } from 'src/stores/RootStoreContext';
import { HomeRoute } from 'src/pages/Home/Route';

import { observer } from 'mobx-react-lite';
interface RequireUnauthenticatedProps {
  children: ReactNode;
}

const RequireUnauthenticated: React.FC<RequireUnauthenticatedProps> = observer(
  ({ children }) => {
    const {
      authStore: { isAuth },
    } = useStores();

    if (isAuth) {
      return <Navigate to={HomeRoute.path} />;
    }

    return <>{children}</>;
  }
);

export default RequireUnauthenticated;
