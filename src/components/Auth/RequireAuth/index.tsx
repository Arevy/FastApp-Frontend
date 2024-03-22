import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStores } from 'src/stores/RootStoreContext';
import { observer } from 'mobx-react-lite';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = observer(({ children }) => {
  const {
    authStore: { isAuth },
  } = useStores();
  const location = useLocation();

  if (!isAuth) {
    // Redirect them to the /login page, but save the current location they were trying to go to when they were redirected.
    // This allows us to send them along to that page after they login, which is a nicer user experience than dropping them off on the home page.

    // The use of replace props force to replace the /login route in the history stack so the user doesn't return to the login page when clicking the back button after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

export default RequireAuth;
