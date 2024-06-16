import React, { useEffect, Fragment, useState } from 'react';
import { SubmitButton } from 'src/components/SmallComponents/SubmitButton';
import { PageTitle } from 'src/components/Top/PageTitle';
import { useStores } from 'src/stores/RootStoreContext';

const Logout = () => {
  const { authStore } = useStores();

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    /* Closing the session after the render of the view */
    console.log('isAuth', authStore.isAuth);
    authStore.removeAuth();
  }, [authStore, submit]);

  return (
    <Fragment>
      <PageTitle text="Log out" />
      <div className="mt-5">
        <SubmitButton
          onClick={() => {
            authStore.removeAuth();
            setSubmit(true);
          }}
        >
          Close session
        </SubmitButton>
      </div>
    </Fragment>
  );
};

export default Logout;
