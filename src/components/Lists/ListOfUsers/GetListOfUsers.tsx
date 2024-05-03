import { Spinner } from "src/components/SmallComponents/Spinner";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import ListOfUsers from "src/components/Lists/ListOfUsers/ListOfUsersComponent";
import React, { useEffect } from "react";
import { useStores } from "src/stores/RootStoreContext";
import { observer } from "mobx-react-lite";

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
    <ListOfUsers
      users={userStore.users}
      updateUserAdminStatus={userStore.updateUserAdminStatus}
    />
  ) : (
    <ErrorAlert errorMessage="No users found" />
  );
});
