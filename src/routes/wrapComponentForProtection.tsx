import React, { ReactElement, ElementType, ComponentType } from 'react';
import RequireAuth from 'src/components/RequireAuth';
import RequireAdminRole from 'src/components/RequireAdminRole';
import RequireUnauthenticated from 'src/components/RequireUnauthenticated';

interface WrapComponentForProtectionProps {
  auth?: boolean;
  admin?: boolean;
  wrapper?: ComponentType<any>; // Accept any type of props for the Wrapper.
}

const wrapComponentForProtection = (
  Component: ElementType,
  { auth, admin, wrapper: Wrapper }: WrapComponentForProtectionProps
): ReactElement => {
  // Intermediate function to clarify content construction.
  const getContent = (): ReactElement | any => {
    if (admin) {
      // Wrap in RequireAuth and RequireAdminRole.
      return (
        <RequireAuth>
          <RequireAdminRole>
            <Component />
          </RequireAdminRole>
        </RequireAuth>
      );
    } else if (auth) {
      // Wrap only in RequireAuth.
      return (
        <RequireAuth>
          <Component />
        </RequireAuth>
      );
    } else {
      // Wrap in RequireUnauthenticated for unauthenticated users.
      return (
        <RequireUnauthenticated>
          <Component />
        </RequireUnauthenticated>
      );
    }
  };

  // Check if an additional Wrapper needs to be applied.
  if (Wrapper) {
    // Return the content with the Wrapper applied if specified.
    return <Wrapper>{getContent()}</Wrapper>;
  } else {
    // Otherwise, return the content directly.
    return getContent();
  }
};

export default wrapComponentForProtection;
