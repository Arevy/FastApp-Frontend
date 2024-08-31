import { makeAutoObservable, runInAction } from 'mobx';
import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';
import * as Queries from 'src/gql/queries/users';
import * as Mutations from 'src/gql/mutations/auth';
import { IUser, UserType } from 'src/gql/types';
import RootStore from './RootStore';

class UserStore {
  private rootStore: RootStore;
  private apolloClient: ApolloClient<NormalizedCacheObject>;

  users: IUser[] = [];
  isLoading: boolean = false;
  error: Error | null | unknown | any = null;
  private queryObservable: ObservableQuery<any> | null = null;

  constructor(
    rootStore: RootStore,
    apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.apolloClient = apolloClient;
  }

  fetchUsers = async () => {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await this.apolloClient.query({
        query: Queries.LIST_ALL_USERS,
      });
      runInAction(() => {
        this.users = result.data.listAllUsers;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
    }
  };

  listAllUsers = async () => {
    this.isLoading = true;
    this.error = null;
    try {
      this.queryObservable = this.apolloClient.watchQuery({
        query: Queries.LIST_ALL_USERS,
        fetchPolicy: 'network-only',
        pollInterval: 600000, // 10 minutes
      });

      this.queryObservable.subscribe({
        next: (response) => {
          runInAction(() => {
            this.users = response.data.listAllUsers;
            this.isLoading = false;
          });
        },
        error: (error) => {
          runInAction(() => {
            this.isLoading = false;
            this.error =
              error instanceof Error
                ? error
                : new Error('An unknown error occurred on subscribe');
          });
        },
      });
    } catch (error) {
      this.isLoading = false;
      this.error =
        error instanceof Error ? error : new Error('An unknown error occurred');
    }
  };

  stopPolling = () => {
    if (this.queryObservable) {
      this.queryObservable.stopPolling();
    }
  };

  updateUserAdminStatus = async (
    _id: string,
    isAdmin: boolean,
    isActive: boolean,
    userType: UserType
  ): Promise<void> => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: Mutations.UPDATE_USER_ADMIN_STATUS,
        variables: { _id, isAdmin, isActive, userType },
      });
      if (result.data.updateUserAdminStatus.success) {
        this.listAllUsers();
      } else {
        this.error = new Error(result.data.updateUserAdminStatus.message);
      }
    } catch (error) {
      this.error = error;
    } finally {
      this.isLoading = false;
    }
  };

  async createUser(
    email: string,
    userName: string,
    password: string,
    userType: string,
    isActive: boolean
  ) {
    this.isLoading = true;
    this.error = null;
    try {
      await this.apolloClient.mutate({
        mutation: Mutations.CREATE_USER,
        variables: { email, userName, password, userType, isActive },
      });
      runInAction(() => {
        this.fetchUsers();
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
    }
  }

  searchAndFilterUsers = (
    searchTerm: string,
    userType: UserType | ''
  ): IUser[] => {
    return this.users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = userType ? user.userType === userType : true;
      return matchesSearch && matchesType;
    });
  };
  deleteUserById = async (_id: string): Promise<void> => {
    this.isLoading = true;
    try {
      const result = await this.apolloClient.mutate({
        mutation: Mutations.DELETE_USER_BY_ID,
        variables: { _id },
      });
      
      if (result.data?.deleteUserById?.success) {
        await this.fetchUsers();
      } else {
        runInAction(() => {
          this.error = new Error(result.data?.deleteUserById?.message || 'Failed to delete user.');
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
  
}

export default UserStore;
