import { Spinner } from 'src/components/SmallComponents/Spinner';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import ListOfUsers from 'src/components/Lists/ListOfUsers/ListOfUsersComponent';
import React, { useEffect } from 'react';
import { useStores } from 'src/stores/RootStoreContext';
import { observer } from 'mobx-react-lite';

export const GetListOfUsers = observer(() => {
  const { userStore, authStore } = useStores();

  useEffect(() => {
    userStore.listAllUsers();

    return () => {
      userStore.stopPolling(); // Stop polling when the component is unmounted
    };
  }, [userStore]);

  const handleUserDeleted = () => {
    userStore.listAllUsers();
  };

  if (userStore.isLoading) return <Spinner />;
  if (userStore.error)
    return <ErrorAlert errorMessage={userStore.error.message} />;

  return userStore.users.length > 0 ? (
    <ListOfUsers
      users={userStore.users}
      updateUserAdminStatus={userStore.updateUserAdminStatus}
      deleteUser={
        authStore.userData.userType === 'ADMIN_USER'
          ? (userId) => userStore.deleteUserById(userId).then(handleUserDeleted)
          : undefined
      }
    />
  ) : (
    <ErrorAlert errorMessage="No users found" />
  );
});
