import { makeAutoObservable } from 'mobx';
import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';

import * as Queries from 'src/gql/queries/users';
import * as Mutations from 'src/gql/mutations/auth';
import { User, UserType } from 'src/gql/types';
import RootStore from './RootStore';

class UserStore {
  private rootStore: RootStore;
  private apolloClient: ApolloClient<NormalizedCacheObject>;

  users: User[] = [];
  isLoading: Boolean = false;
  error: Error | null = null;
  private queryObservable: ObservableQuery<any> | null = null;

  constructor(
    rootStore: RootStore,
    apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.apolloClient = apolloClient;
  }

  async registerUser(email: string, password: string, userType: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.REGISTER_USER,
        variables: { email, password, userType },
      });

      const token = response.data?.registerUser?.token;
      if (token) {
        this.rootStore.authStore.activateAuth(token); // Use activateAuth from AuthStore
      }

      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error =
        error instanceof Error ? error : new Error('An unknown error occurred');
    }
  }

  async listAllUsers() {
    this.isLoading = true;
    this.error = null;
    try {
      this.queryObservable = this.apolloClient.watchQuery({
        query: Queries.LIST_ALL_USERS,
        fetchPolicy: 'network-only',
        pollInterval: 600000, // Example: 10 minutes
      });

      this.queryObservable.subscribe({
        next: (response) => {
          this.users = response.data.listAllUsers;
          this.isLoading = false;
        },
        error: (error) => {
          // Error handling
          this.isLoading = false;
          this.error =
            error instanceof Error
              ? error
              : new Error('An unknown error occurred on subscribe');
        },
      });
    } catch (error) {
      console.error('Failed to initialize users query:', error);
      this.isLoading = false;
      this.error =
        error instanceof Error ? error : new Error('An unknown error occurred');
    }
  }

  async stopPolling() {
    if (this.queryObservable) {
      this.queryObservable.stopPolling();
    }
  }
  updateUserAdminStatus = async (
    uuid: string,
    isAdmin: boolean,
    isActive: boolean,
    userType: UserType
  ): Promise<void> => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: Queries.UPDATE_USER_ADMIN_STATUS,
        variables: { uuid, isAdmin, isActive, userType },
      });
      if (result.data.updateUserAdminStatus.success) {
        console.log(
          'Update successful:',
          result.data.updateUserAdminStatus.message
        );
        this.listAllUsers(); // Re-fetch the users list to reflect the changes
      } else {
        console.error(
          'Update failed:',
          result.data.updateUserAdminStatus.message
        );
      }
    } catch (error) {
      console.error('Failed to update user admin status', error);
    } finally {
      this.isLoading = false;
    }
  };

  // Add more functions for other operations
}

export default UserStore;
