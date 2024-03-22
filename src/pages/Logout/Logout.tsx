import React, { useEffect, Fragment } from 'react';
import { SubmitButton } from 'src/components/SmallComponents/SubmitButton';
import { PageTitle } from 'src/components/Top/PageTitle';
import { useStores } from 'src/stores/RootStoreContext';

const Logout = () => {
  const {
    authStore: { removeAuth },
  } = useStores();

  useEffect(() => {
    /* Closing the session after the render of the view */
    removeAuth();
  }, [removeAuth]);

  return (
    <Fragment>
      <PageTitle text="Log out" />
      <div className="mt-5">
        <SubmitButton onClick={removeAuth}>Close session</SubmitButton>
      </div>
    </Fragment>
  );
};

export default Logout;
