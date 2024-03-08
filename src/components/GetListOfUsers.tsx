// import { useQuery } from "@apollo/client";

import { Spinner } from './Spinner';
import { ErrorAlert } from './ErrorAlert';
import ListOfUsers from './ListOfUsers';
import React, { useEffect } from 'react';
import { useStores } from 'src/stores/RootStoreContext';
import { observer } from 'mobx-react-lite';

export const GetListOfUsers = observer(() => {
  // const { loading, error, data, startPolling, stopPolling } = useQuery(LIST_ALL_USERS, { fetchPolicy: 'no-cache' });

  const { userStore } = useStores();

  useEffect(() => {
    userStore.listAllUsers();

    return () => {
      userStore.stopPolling(); // Stop polling when the component is unmounted
    };
  }, [userStore]);

  if (userStore.isLoading) return <Spinner />;
  if (userStore.error)
    return <ErrorAlert errorMessage={userStore.error.message} />;

  return userStore.users.length > 0 ? (
    <ListOfUsers users={userStore.users} />
  ) : (
    <ErrorAlert errorMessage="No users found" />
  );
});
