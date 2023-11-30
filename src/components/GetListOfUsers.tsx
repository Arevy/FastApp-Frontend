import { useQuery } from '@apollo/client';

import { Spinner } from './Spinner';
import { ErrorAlert } from './ErrorAlert';

import { LIST_ALL_USERS } from '../gql/queries/users';
import ListOfUsers from './ListOfUsers';
import React from 'react';

export const GetListOfUsers = () => {
	const { loading, error, data, startPolling, stopPolling } = useQuery(LIST_ALL_USERS, { fetchPolicy: 'no-cache' });

	if (loading) return <Spinner />;
	if (error) return <ErrorAlert errorMessage={error.message} />;

	return <ListOfUsers users={data.listAllUsers} startPolling={startPolling} stopPolling={stopPolling} />;
};